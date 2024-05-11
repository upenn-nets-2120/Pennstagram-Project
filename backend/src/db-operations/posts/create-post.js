import db from '../../db-setup/db_access.js';
import {
    linkHashtagsToPost,
    extractHashtags
} from '../index.js';

const createPost = async (newPost) => {
    try {
    console.log("Creating post with data: ", newPost);
    const query = `
        INSERT INTO posts (image, caption, postVisibility, post_json)
        VALUES ("${newPost.image}", "${newPost.caption}", "${newPost.postVisibility}", "${JSON.stringify(newPost.post_json)}")
    `;
    const result = await db.send_sql(query, [newPost.image, newPost.caption, newPost.postVisibility, JSON.stringify(newPost.post_json)]);
    const postID = result.insertId;

    let hashtags = newPost.hashtag ? newPost.hashtag.split(' ') : [];
    if (newPost.caption.includes('#')) {
        hashtags = [...hashtags, ...extractHashtags(newPost.caption)];
    }
    if (hashtags.length > 0) {
        await linkHashtagsToPost(hashtags, postID);
    }
    return postID;
    /*if (newPost.hashtag) {
        await linkHashtagsToPost(newPost.hashtag, postId);
    }
    return postID;*/
    //return the ID of new post?
    } catch (error) {
        console.error("Error in createPost: ", error);
        throw error;
    }
};

export default createPost;
