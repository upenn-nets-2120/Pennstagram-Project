import db from '../../db-setup/db_access.js';

const modifyUserHashtag = async (username, hashtag, operation) => {
    let results1, results2;

    if (operation === 1) { // we're adding
        const insertHashtagQuery = `
            INSERT INTO hashtags (phrase)
            SELECT '${hashtag}'
            WHERE NOT EXISTS (SELECT 1 FROM hashtags WHERE phrase = '${hashtag}')
        `;
        results1 = await db.send_sql(insertHashtagQuery);

        const addUserHashtagQuery = `
            INSERT INTO users2hashtags (userID, hashtagID)
            SELECT
                (SELECT userID FROM users WHERE username = '${username}'),
                (SELECT hashtagID FROM hashtags WHERE phrase = '${hashtag}')
            WHERE NOT EXISTS (
                SELECT 1
                FROM users2hashtags
                WHERE userID = (SELECT userID FROM users WHERE username = '${username}')
                AND hashtagID = (SELECT hashtagID FROM hashtags WHERE phrase = '${hashtag}')
            );
        `;
        results2 = await db.send_sql(addUserHashtagQuery);

    } else { // we're deleting
        const deleteUserHashtagQuery = `
            DELETE FROM users2hashtags
            WHERE userID = (SELECT userID FROM users WHERE username = '${username}')
            AND hashtagID = (SELECT hashtagID FROM hashtags WHERE phrase = '${hashtag}')
        `;
        results1 = await db.send_sql(deleteUserHashtagQuery);

        // Find the hashtagID if it is no longer used
        const findUnusedHashtagIDQuery = `
            SELECT h.hashtagID
            FROM hashtags h
            LEFT JOIN users2hashtags u2h ON h.hashtagID = u2h.hashtagID
            LEFT JOIN posts2hashtags p2h ON h.hashtagID = p2h.hashtagID
            WHERE h.phrase = '${hashtag}' AND u2h.hashtagID IS NULL AND p2h.hashtagID IS NULL
            LIMIT 1;
        `;
        const unusedHashtagResult = await db.send_sql(findUnusedHashtagIDQuery);

        if (unusedHashtagResult.length > 0) {
            const hashtagID = unusedHashtagResult[0].hashtagID;
            // Delete the hashtag if no longer linked
            const deleteHashtagQuery = `DELETE FROM hashtags WHERE hashtagID = ${hashtagID}`;
            results2 = await db.send_sql(deleteHashtagQuery);
        }
    }

    return [results1, results2];
};

export default modifyUserHashtag;
