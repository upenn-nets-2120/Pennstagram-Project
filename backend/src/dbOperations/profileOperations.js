// database operations corresponding to profileUpdates.js backend routes
import db from '../database/db_access.js';

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

export default {
    getOwnUser,
    getOtherUser,
    modifyUser,
    getOwnHashtags,
    getPopularHashtags,
    modifyInterestedHashtag,
    addNotification,
};
