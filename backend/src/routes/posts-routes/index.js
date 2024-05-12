import express from 'express';
import db from '../../db-setup/db_access.js';
import {
    createPost,
    updatePost,
    deletePost,
    likePost,
    commentPost,
    fetchPostsForUser
} from '../../db-operations/index.js';
import authUtils from '../../utils/authUtils.js';

const posts = express.Router();

// TODO: check Logged In --> use helper funtion and return true (should return when user is logged in)
// "testing if this goes through"

//fetch all posts
posts.get('/fetchAllPosts', async (req, res) => {
    if (!authUtils.isOK(username)) {
        return res.status(403).json({error: 'You forgot an input OR: one or more of your inputs is potentially an SQL injection attack.'})
    }

    // Verify the user's original username for security reasons
    if (!req.session || req.session.username !== username) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }

    const posts = await db.send_sql('SELECT * FROM posts;');
    try {
        const posts = await db.send_sql(sql);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: 'Error querying database'});
    }
});

//create a new post
posts.post('/newPost', async (req, res) => {
    const {caption, hashtag, image, postVisibility} = req.body;
    const username = req.session.username; // USE req.session.username INSTEAD

    //check if at least one of caption, hashtag, or image is provided
    if (!((authUtils.isOK(caption) || authUtils.isOK(hashtag) || authUtils.isOK(image)))) {
        return res.status(400).json({error: 'at least one of caption, hashtag, or image must be provided OR one or more of your inputs is potentially an SQL injection attack'});
    }
    // Verify the user's original username for security reasons
    if (!req.session || req.session.username !== username || req.session.username == null) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }

    //check if postVisibility is provided
    if (!postVisibility || !['everyone', 'private', 'followers'].includes(postVisibility)) {
        res.status(400).json({error: 'postVisibility is required'});
        return;
     }
     
    // const kafkaPost = {
    //     post_json: {
    //         username: username,
    //         source_site: 'g07',
    //         post_uuid_within_site: null, //gets replaced with the postID of the new post
    //         post_text: caption,
    //         content_type: 'BLOB' //NOTE: replace with public url to the s3 image file
    //     },
    //     attach: {image}
    // }
     
     const post_json = {
        username: username,
        source_site: 'g07',
        post_uuid_within_site: null, //replace with the postID of the new post
        post_text: caption,
     };

    const getUserID = async (username) => {
        const query = `SELECT userID FROM users WHERE username = '${username}'`;
        const result = await db.send_sql(query);
        return result[0].userID;
    };

    const usernamesUserID = await getUserID(username);

    const newPostData = {
        userID: usernamesUserID,
        image: image,
        caption: caption,
        postVisibility: postVisibility,
        post_json: post_json // Object, not a string
    };
    try {
        const postID = await createPost(newPostData);
        res.status(201).json({message: 'Post created', postID: postID});
    } catch (error) {
        console.error("Error creating post: ", error);
        res.status(500).json({error: 'Error creating post'});
    }
});

//update a post
posts.put('/updatePost/:postID', async (req, res) => {
    const postID = Number(req.params.postID);
    if (isNaN(postID)) {
        return res.status(400).json({error: 'Invalid postID'});
    }
    const {caption, hashtag, image, postVisibility} = req.body;
    const username = req.session.username; // USE req.session.username INSTEAD
    console.log("postID " + postID);
    console.log("username " + username);

    //check if at least one of caption, hashtag, or image is provided
    if (!((authUtils.isOK(caption) || authUtils.isOK(hashtag) || authUtils.isOK(image)) || authUtils.isOK(postVisibility))) {
        return res.status(400).json({error: 'at least one of caption, hashtag, or image must be provided OR one or more of your inputs is potentially an SQL injection attack'});
    }

    //check if postVisibility is valid
    if (!postVisibility || !['everyone', 'private', 'followers'].includes(postVisibility)) {
        res.status(400).json({error: 'Invalid postVisibility'});
        return;
    }

    // Verify the user's original username for security reasons
    if (!req.session || req.session.username !== username || req.session.username == null) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }

    //get the post from the database
    const post = await db.send_sql(`SELECT * FROM posts WHERE postID = ${postID}`);
    console.log("post " + JSON.stringify(post));

    const postUserID = post[0].userID;
    const postCaption = post[0].caption;
    const postHashtag = post[0].hashtag;
    const postImage = post[0].image;
    const postVisibilitys = post[0].postVisibility;
    const postJson = post[0].post_json;

    //get the userID from the username
    const query = `SELECT userID FROM users WHERE username = '${username}'`;
    const result = await db.send_sql(query);
    const userID = result[0].userID;

    //check if the post exists and if the post id and user matches
    if (post.length == 0 || postUserID != userID) {
        res.status(403).json({ error: 'post does not exist'});
        return;
    }  
    try {
        await updatePost(postID, postCaption, postHashtag, postImage, postVisibilitys, postJson);
        res.status(200).json({message: 'Post updated'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database'});
    }
});

//delete a post
posts.delete('/deletePost/:postID', async (req, res) => {
    const postID = Number(req.params.postID);
    if (isNaN(postID)) {
        return res.status(400).json({error: 'Invalid postID'});
    }
    const username = req.session.username; // USE req.session.username INSTEAD

     // Verify the user's original username for security reasons
    if (!req.session || req.session.username !== username || req.session.username == null) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }

    //get the post from the database
    const post = await db.send_sql(`SELECT * FROM posts WHERE postID = ${postID}`);
    console.log("post[0].userID " +  post[0].userID);

    //check if the post exists and if the userID matches
    if (!post || post[0].userID !== username) {
        res.status(403).json({ error: 'post does not exist or not your post to delete'});
        return;
    }   
    try {
        await deletePost(postID);
        res.status(200).json({message: 'Post deleted.'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database.'});
    }
});

//like a post
posts.post('/likePost/:postID', async (req, res) => {
    const postID = Number(req.params.postID);
    if (isNaN(postID)) {
        return res.status(400).json({error: 'Invalid postID'});
    }
    const username = req.session.username; 
    // Verify the user's original username for security reasons
    if (!req.session || req.session.username !== username || req.session.username == null) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }

    try {
        await likePost(postID, username);
        res.status(200).json({message: 'Post liked.'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database.'});
    }
    res.status(200).json({ message: 'post liked successfully' });
});

//comment on a post
posts.post('/commentPost', async (req, res) => {
    const postID = Number(req.params.postID);
    console.log(`postID in commentPost: ${postID}`);

    if (isNaN(postID)) {
        return res.status(400).json({error: 'Invalid postID'});
    }
    const username = req.session.username; // USE req.session.username INSTEAD

    // Verify the user's original username for security reasons
    if (!req.session || req.session.username !== username || req.session.username == null) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }

    const {content, parentCommentID} = req.body;
    console.log(`content: ${content}, parentCommentID: ${parentCommentID}`);

    //check if comment is gievn
    if (!comment) {
        res.status(400).json({error: 'you need to give a comment'});
        return;
    }

    const post = await db.send_sql(`SELECT * FROM posts WHERE postID = ${postID}`);
    console.log(`post: ${JSON.stringify(post)}`);

    const postUserID = post[0].userID; 
    console.log("postUserID " + postUserID);

    //check if the actually post exists
    if (!post || postlength == 0) {
        res.status(404).json({error: 'Post does not exist'});
        return;
    }
    try {
        await commentPost(postID, username, content, parentCommentID);
        res.status(200).json({message: 'Comment posted.'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database.'});
    }
});

//fetch posts recommended for a user
posts.get('/fetchPosts', async (req, res) => {
    // Verify the user's original username for security reasons
    if (!req.session || req.session.username !== username || req.session.username == null) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }
    try {
        const posts = await fetchPostsForUser(req.params.username);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error querying database' });
    }
});

export default posts;