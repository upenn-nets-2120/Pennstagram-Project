import db from '../../db-setup/db_access.js';
import {
    linkHashtagsToPost,
    extractHashtags
} from '../index.js';

const commentPost = async (postID, userID, content, parentCommentID) => {
    const query = `INSERT INTO comments (postID, userID, content, parentCommentID) VALUES (${postID}, ${userID}, '${content}', ${parentCommentID || 'NULL'})`;
    const result = await db.send_sql(query);
    const commentID = result.insertId;

    if (content.includes('#')) {
        const extractedHashtags = extractHashtags(content);
        await linkHashtagsToPost(extractedHashtags, postID);
    }
    return commentID;
};

export default commentPost;
