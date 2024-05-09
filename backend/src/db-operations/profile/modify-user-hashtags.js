import db from '../../db-setup/db_access.js';

const modifyUserHashtag = async (username, hashtag, operation) => {
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

export default modifyUserHashtag;