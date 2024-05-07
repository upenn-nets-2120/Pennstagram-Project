import db from '../../database/db_access';

const addUserHashtags = async (username, hashtags) => {
    const sql = `
        INSERT INTO user_hashtags (username, hashtag)
        VALUES ${hashtags.map(hashtag => `('${username}', '${hashtag}')`).join(', ')}
    ;`;

    return await db.insert_items(sql);
}

export { addUserHashtags };
