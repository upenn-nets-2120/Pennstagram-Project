import db from '../../db-setup/db_access.js';

const linkHashtagsToPost = async (hashtags, postId) => {
    const insertHashtagQuery = `INSERT IGNORE INTO hashtags (hashtag) VALUES (?)`;
    const getHashtagIdQuery = `SELECT hashtagID FROM hashtags WHERE hashtag = ?`;
    const linkHashtagToPostQuery = `INSERT INTO posts2hashtags (postID, hashtagID) VALUES (?, ?)`;

    for (const hashtag of hashtags) {
        await db.send_sql(insertHashtagQuery, [hashtag]);
        const results = await db.send_sql(getHashtagIdQuery, [hashtag]);
        const hashtagId = results[0].hashtagID;
        await db.send_sql(linkHashtagToPostQuery, [postId, hashtagId]);
    }
};

export default linkHashtagsToPost;
