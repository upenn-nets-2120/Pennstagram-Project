import db from '../../rds-setup/db_access.js';
import {
    linkHashtagsToPost,
    extractHashtags
} from '../index.js';

const commentPost = async (postID, userID, content, parentCommentID) => {
    const query = `INSERT INTO comments (postID, userID, content, parentCommentID) VALUES (${postID}, ${userID}, '${comment}', ${parentCommentID || 'NULL'})`;
    const result = await db.send_sql(query);
    const commentID = result.insertId;

    if (comment.includes('#')) {
        const extractedHashtags = extractHashtags(comment);
        await linkHashtagsToPost(extractedHashtags, postID);
    }
    return commentID;
};

export default commentPost;
