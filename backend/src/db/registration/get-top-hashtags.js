import db from '../../database/db_access';

const getTopHashtags = async (limit) => {
    const sql = `
        SELECT hashtag, COUNT(*) as count
        FROM user_hashtags
        GROUP BY hashtag
        ORDER BY count DESC
        LIMIT ${limit}
    ;`;

    return await db.query(sql);
}

export { getTopHashtags };
