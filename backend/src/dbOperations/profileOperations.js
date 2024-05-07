// database operations corresponding to profileUpdates.js backend routes
import db from '../../database/db_access.js';
import pkg from '../utils/actor-face-match/app.js';
const { main } = pkg;

const getOwnUser = async (username) => {
    const query = `SELECT userID, username, firstName, lastName, emailID, userProfilePic, userScore, userVisibility, actors
                   FROM users 
                   WHERE username = ?`;
    const result = await db.send_sql(query, [username]);
    return result;
}

const getOtherUser = async (username) => {
    const query = `SELECT username, userProfilePic,
                   FROM users 
                   WHERE username = ?;`;
    const result = await db.send_sql(query, [username]);
    return result;
}

const modifyUser = async (newUsername, newEmail, newPassword) => {

    let updates = [];
    let params =[];

    if (newUsername) {
        updates.push('username = ?');
        params.push(newUsername);
    }
    if (newEmail) {
        updates.push('emailID = ?');
        params.push(newEmail);
    }
    if (newPassword) { // Assuming password is already hashed (salted) before reaching here
        updates.push('salted_password = ?');
        params.push(newPassword);
    }

    if (updates.length === 0) {
        return res.status(400).send('No updates provided');
    }

    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE username = ?`;
    params.push(username); // Ensure the last parameter is the username for the WHERE clause

    const result = await db.send_sql(updateQuery, params);
    return result;
}

const getOwnHashtags = async (username) => {
    const hashtagQuery = `SELECT h.hashtagID
                          FROM users u
                          JOIN users2hashtags h ON u.userID = h.userID
                          WHERE u.username = ?`;
    const results = await db.send_sql(hashtagQuery, [username]);
    return results;
};

const getPopularHashtags = async () => {
    const popularityQuery = `SELECT h.phrase, SUM(total.count) AS popularity
                             FROM (
                                SELECT hashtagID, COUNT(*) AS count
                                FROM posts2hashtags
                                GROUP BY hashtagID
                                UNION ALL
                                SELECT hashtagID, COUNT(*) AS count
                                FROM users2hashtags
                                GROUP BY hashtagID
                             ) AS total
                             JOIN hashtags h ON h.hashtagID = total.hashtagID
                             GROUP BY total.hashtagID
                             ORDER BY popularity DESC;`
    const results = await db.send_sql(popularityQuery);
    return results;
};

const modifyInterestedHashtag = async (username, hashtag, operation) => {
    let results1;
    let results2;

    if (operation === 1) { // we're adding
        const insertHashtagQuery = `INSERT INTO hashtags (phrase)
                                    SELECT ?
                                    WHERE NOT EXISTS (SELECT 1 FROM hashtags WHERE phrase = ?)`;
        results1 = await db.send_sql(insertHashtagQuery, [hashtag, hashtag]);

        // Add the hashtag to the user's list of interested hashtags
        const addUserHashtagQuery = `INSERT INTO users2hashtags (userID, hashtagID)
                                     SELECT (SELECT userID FROM users WHERE username = ?), (SELECT hashtagID FROM hashtags WHERE phrase = ?)
                                     WHERE NOT EXISTS (
                                     SELECT 1 FROM users2hashtags WHERE userID = (SELECT userID FROM users WHERE username = ?) AND hashtagID = (SELECT hashtagID FROM hashtags WHERE phrase = ?);)`;
        results2 = await db.send_sql(addUserHashtagQuery, [username, hashtag, username, hashtag]);

    } else { // we're deleting
        const deleteUserHashtagQuery = `DELETE FROM users2hashtags
                                        WHERE userID = (SELECT userID FROM users WHERE username = ?)
                                            AND hashtagID = (SELECT hashtagID FROM hashtags WHERE phrase = ?);`;
        results1 = await db.send_sql(deleteUserHashtagQuery, [username, hashtag]);

        // Delete hashtag if it's no longer linked to any posts or users
        const deleteHashtagQuery = `DELETE FROM hashtags
                                    WHERE hashtagID = (SELECT hashtagID FROM hashtags WHERE phrase = ?)
                                    AND NOT EXISTS (SELECT 1 FROM users2hashtags WHERE hashtagID = (SELECT hashtagID FROM hashtags WHERE phrase = ?))
                                    AND NOT EXISTS (SELECT 1 FROM posts2hashtags WHERE hashtagID = (SELECT hashtagID FROM hashtags WHERE phrase = ?));`;
        results2 = await db.send_sql(deleteHashtagQuery, [hashtag, hashtag, hashtag]);
    }
    return [results1, results2];
};

const addNotification = async (username, content, type) => {

    // Step 1: Retrieve the userID for the given username
    const userResult = await getOwnUser(username);
    const userID = userResult[0].userID;

    // Step 2: Insert the notification into the notifications table
    const notificationQuery = `
        INSERT INTO notifications (userID, type, content)
        VALUES (?, ?, ?)`;
    const result = await db.send_sql(notificationQuery, [userID, type, content]);
    return result;
};

const getProfilePic = async (username) => {
    // retrieve user profile photo from username
    const result = await db.send_sql(`SELECT userProfilePic from users
                                      WHERE username = ?`, [username]);
    return result;
};

// automatically recomputes the similarActors and stores them with the associated user in users2actors
const modifyProfilePic = async (username, profilePic) => {
    // retrieve user profile photo from username
    const modifyResult = await db.send_sql(`UPDATE users SET userProfilePic = ? WHERE username = ?`, [profilePic, username]);

    // delete previous similar actors
    const deleteResult = await removeExistingUserActorLinks(username);

    // recalculate similar actors
    const recalculateResult = await findTopFaceMatches(username);

    // set similar actors in database
    const setSimilarResult = await setSimilarActors(username, recalculateResult);
    return { modify: modifyResult, delete: deleteResult, recalculate: recalculateResult, setSimilar: setSimilarResult};
};

const getUserLinkedActor = async (username) => {
    const result = await db.send_sql(`SELECT linked_actor_nconst FROM users
                                      WHERE username = ?`, [username]);
    return result;
};

const getSimilarActorsFromDB = async (username) => {
    const userResult = await getOwnUser(username);
    const userID = userResult[0].userID;

    const result = await db.send_sql(`SELECT actor_nconst_short FROM users2actors
                                      WHERE userID = ?`, [userID]);
    return result;
};

const removeExistingUserActorLinks = async (username) => {
    // Step 1: Retrieve the userID for the given username
    const userResult = await getOwnUser(username);
    const userID = userResult[0].userID;

    const deleteQuery = 'DELETE FROM users2actors WHERE userID = ?';
    const result = await db.send_sql(deleteQuery, [userID]);

    console.log(`Deleted ${result.affectedRows} entries from 'users2actors' for user ${username} (userID: ${userID}).`);
    return result;
};

const modifyUserLinkedActor = async (username, newActorNConst) => {
    const updateQuery = 'UPDATE users SET linked_actor_nconst = ? WHERE username = ?';
    const updateResults = await db.query(updateQuery, [newActorNConst, username]);

    return updateResults;
};

const setSimilarActors = async (username, similarActors) => {
    const userResult = await getOwnUser(username);
    const userID = userResult[0].userID;

    // Insert new similar actor links
    const insertQuery = 'INSERT INTO users2actors (userID, actor_nconst_short) VALUES ?';
    const values = similarActors.map(actorList => 
       actorList.map(actor => [userID, actor.id.split('-')[0]]) // Assuming actor ID format includes nconst
    ).flat();
     
    let result;
    if (values.length > 0) {
         result = await db.send_sql(insertQuery, [values]);
         console.log(`Updated similar actors for user ${username}`);
    } else {
        result = { error: "updating simliar actors did not work; couldn't parse the return from main() in app.js of similarActors calculations."};
    }

    return result;
};

const findTopFaceMatches = async (username) => {
    // retrieve user profile photo from username
    const userProfilePic = await getProfilePic(username);
    const result = await main(userProfilePic);
    return result;
};

export default {
    getOwnUser,
    getOtherUser,
    modifyUser,
    getOwnHashtags,
    getPopularHashtags,
    modifyInterestedHashtag,
    addNotification,
    getProfilePic,
    modifyProfilePic,
    getUserLinkedActor,
    modifyUserLinkedActor,
    getSimilarActorsFromDB,
    setSimilarActors,
    removeExistingUserActorLinks,
    findTopFaceMatches,
};
