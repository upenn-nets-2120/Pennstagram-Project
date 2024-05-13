import db from '../../db-setup/db_access.js';

const getTopHashtags = async (limit) => {
    const sql = `
        SELECT h.phrase, COUNT(u.hashtagID) as count
        FROM hashtags u
        JOIN hashtags h ON u.phrase = h.phrase
        GROUP BY u.phrase
        ORDER BY count DESC
        LIMIT ${limit}
    ;`;

    return await db.send_sql(sql);
}

export default getTopHashtags;
