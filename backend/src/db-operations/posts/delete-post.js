// db/posts/deletePost.js
import db from '../../db-setup/db_access.js';

const deletePost = async (postID) => {
    //need to delete all comments, likes, hashtags and the post itself
    const deleteCommentsQuery = `DELETE FROM comments WHERE postID = ${postID}`;
    await db.send_sql(deleteCommentsQuery);
    const deleteLikesQuery = `DELETE FROM likes WHERE postID = ${postID}`;
    await db.send_sql(deleteLikesQuery);
    const deleteHashtagsQuery = `DELETE FROM posts2hashtags WHERE postID = ${postID}`;
    await db.send_sql(deleteHashtagsQuery);
    const deletePostQuery = `DELETE FROM posts WHERE postID = ${postID}`;
    await db.send_sql(deletePostQuery);
};

export default deletePost;
