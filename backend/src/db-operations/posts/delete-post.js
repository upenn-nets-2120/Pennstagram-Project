// db/posts/deletePost.js
import db from '../../db-setup/db_access.js';

const deletePost = async (postID) => {
    const query = `DELETE FROM posts WHERE postID = ?`;
    await db.send_sql(query, [postID]);
};

export default deletePost;
