import db from '../../rds-setup/db_access.js';
import {
    linkHashtagsToPost,
    extractHashtags
} from '../index.js';

const createPost = async (newPost) => {
    try {
    const imageValue = newPost.image ? `"${newPost.image}"` : "NULL";
    const postJsonString = JSON.stringify(newPost.post_json);

    console.log("Creating post with data: ", newPost);
    console.log("in create post, userID is " + newPost.userID);
    const query = `
        INSERT INTO posts (userID, image, caption, postVisibility, post_json)
        VALUES ("${newPost.userID}", "${imageValue}", "${newPost.caption}", "${newPost.postVisibility}", '${postJsonString}')
    `;
    console.log('query:', query, [postJsonString]);
    const result = await db.send_sql(query);
    const postID = result.insertId;

    let hashtags = newPost.hashtag ? newPost.hashtag.split(' ') : [];
    if (newPost.caption.includes('#')) {
        hashtags = [...hashtags, ...extractHashtags(newPost.caption)];
    }
    if (hashtags.length > 0) {
        await linkHashtagsToPost(hashtags, postID);
    }
    return postID;
    } catch (error) {
        console.error("Error in createPost: ", error);
        throw error;
    }
};

export default createPost;
