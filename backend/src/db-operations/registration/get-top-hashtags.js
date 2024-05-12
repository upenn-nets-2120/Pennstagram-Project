import db from '../../db-setup/db_access.js';

const getTopHashtags = async (limit) => {
    const sql = `
        SELECT h.phrase, COUNT(u.hashtagID) as count
        FROM users2hashtags u
        JOIN hashtags h ON u.hashtagID = h.hashtagID
        GROUP BY u.hashtagID
        ORDER BY count DESC
        LIMIT ${limit}
    ;`;

    return await db.send_sql(sql);
}

export default getTopHashtags;
