import db from '../../../database/db_access.js';

const addUserHashtags = async (username, hashtags) => {
    const sql = `
        INSERT INTO users2hashtags (username, hashtags)
        VALUES ${hashtags.map(hashtags => `('${username}', '${hashtags}')`).join(', ')}
    ;`;

    return await db.insert_items(sql);
}

export default addUserHashtags;
