import db from '../../db-setup/db_access.js';
import {
    linkHashtagsToPost,
    extractHashtags
} from '../index.js';

const updatePost = async (postID, caption, hashtag, image, postVisibility, post_json) => {
    const updates = [];
    const values = [];

    if (caption !== undefined) {
        updates.push('caption = ?');
        values.push(caption);
    }
    if (image !== undefined) {
        updates.push('image = ?');
        values.push(image);
    }
    if (postVisibility !== undefined) {
        updates.push('postVisibility = ?');
        values.push(postVisibility);
    }
    if (post_json !== undefined) {
        updates.push('post_json = ?');
        values.push(JSON.stringify(post_json));
    }

    if (updates.length > 0) {
        const query = `UPDATE posts SET ${updates.join(', ')} WHERE postID = ?`;
        values.push(postID);
        await db.send_sql(query, values);
    }

    if (caption !== undefined || hashtag !== undefined) {
        let hashtags = hashtag ? hashtag.split(' ') : [];
        if (caption && caption.includes('#')) {
            hashtags = [...hashtags, ...extractHashtags(caption)];
        }
        if (hashtags.length > 0) {
            await linkHashtagsToPost(hashtags, postID);
        }
    }
};

export default updatePost;
