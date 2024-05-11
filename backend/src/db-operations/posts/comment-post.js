import db from '../../db-setup/db_access.js';
import {
    linkHashtagsToPost,
    extractHashtags
} from '../index.js';

const commentPost = async (postID, userID, comment, parentCommentID) => {
    //const newCommentParams = [postID, userID, comment, (parentCommentID || null)];
    const query = 'INSERT INTO comments (postID, userID, comment, parentCommentID) VALUES (?, ?, ?, ?)';
    const result = await db.send_sql(query, [postID, userID, comment, parentCommentID || null]);
    const commentID = result.insertId;

    if (comment.includes('#')) {
        const extractedHashtags = extractHashtags(comment);
        await linkHashtagsToPost(extractedHashtags, postID);
    }
    return commentID;
};

export default commentPost;
