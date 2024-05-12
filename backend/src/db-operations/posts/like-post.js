import db from '../../db-setup/db_access.js';

const likePost = async (postID, userID) => {
    const query = `INSERT INTO likes (postID, liker) VALUES (${postID}, ${userID})`;
    await db.send_sql(query, [postID, userID]);
};

export default likePost;
