import db from '../../db-setup/db_access.js';
import {
    linkHashtagsToPost,
    extractHashtags
} from '../index.js';

const updatePost = async (postID, caption, hashtag, image, postVisibility, post_json) => {
    const updates = [];
    console.log('PostID:', postID, 'Caption:', caption, 'Hashtag:', hashtag, 'Image:', image, 'PostVisibility:', postVisibility, 'Post_json:', post_json);
    if (caption != undefined) {
        updates.push(`caption = '${caption}'`);
    }
    if (image != undefined) {
        updates.push(`image = '${image}'`);
    }
    if (postVisibility != undefined) {
        updates.push(`postVisibility = '${postVisibility}'`);
    }
    if (post_json != undefined) {
        const post_json_string = JSON.stringify(post_json);
        updates.push(`post_json = '${post_json_string}'`);
    }

    console.log('Updates:', updates); // Log the updates array

    if (updates.length > 0) {
        const query = `UPDATE posts SET ${updates.join(', ')} WHERE postID = ${postID}`;
        console.log('Query:', query);
        await db.send_sql(query);
    }

    if (caption !== undefined || hashtag !== undefined) {
        let hashtags = hashtag ? hashtag.split(' ') : [];
        if (caption && caption.includes('#')) {
            hashtags = [...hashtags, ...extractHashtags(caption)];
        }
        console.log('Hashtags:', hashtags);
        if (hashtags.length > 0) {
            await linkHashtagsToPost(hashtags, postID);
        }
    }
};

export default updatePost;
