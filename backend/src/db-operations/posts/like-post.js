import db from '../../db-setup/db_access.js';

const likePost = async (postID, userID) => {
    try {
        const query = `INSERT INTO likes (postID, liker) VALUES (${postID}, '${userID}')`;
        console.log('Query:', query);
        await db.send_sql(query);
    } catch (error) {
        console.error('Error:', error);
    }
};

export default likePost;
