import db from '../../rds-setup/db_access.js';

const getUserHashtags = async (username) => {
    const hashtagQuery = `SELECT h.hashtagID
                          FROM users u
                          JOIN users2hashtags h ON u.userID = h.userID
                          WHERE u.username = '${username}';`;
    const results = await db.send_sql(hashtagQuery);
    return results;
};

export default getUserHashtags;