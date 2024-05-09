import db from '../../db-setup/db_access.js';

const getOwnHashtags = async (username) => {
    const hashtagQuery = `SELECT h.hashtagID
                          FROM users u
                          JOIN users2hashtags h ON u.userID = h.userID
                          WHERE u.username = ?`;
    const results = await db.send_sql(hashtagQuery, [username]);
    return results;
};

export default getOwnHashtags;