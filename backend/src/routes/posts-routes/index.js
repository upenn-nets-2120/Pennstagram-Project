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
import {uploadImageToS3} from '../../s3-setup/uploadImageToS3.js';    
import multer from 'multer';

const posts = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


//upload image for a post
posts.post('/uploadImage', upload.single('file'), async (req, res) => {
    // Verify the user's original username for security reasons
    const username = req.session.username;
    const image = req.file;

    if (!req.session || req.session.username !== username || req.session.username == null) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }

    if (!image) {
        return res.status(400).json({error: 'No image provided'});
    }

    try {
        const url = await uploadImageToS3(image);
        res.status(200).json({imageUrl: url});
    } catch (err) {
        res.status(500).json({error: 'Error uploading image', details: err.message});
    }
});

//fetch all posts for a user
posts.get('/fetchAllPosts', async (req, res) => {
    console.log("fetchAllPosts");
    const username = req.session.username;
    if (!authUtils.isOK(username)) {
        return res.status(403).json({error: 'You forgot an input OR: one or more of your inputs is potentially an SQL injection attack.'})
    }

    // Verify the user's original username for security reasons
    if (!req.session || req.session.username !== username || req.session.username == null) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }
    
    try {
        const query = `
            SELECT p.*, COUNT(l.liker) as likes
            FROM posts p
            LEFT JOIN likes l ON p.postID = l.postID
            WHERE p.userID = (SELECT userID FROM users WHERE username = '${username}')
            GROUP BY p.postID
            ORDER BY p.timeStamp DESC;
        `;
        console.log("query", query);
        const posts = await db.send_sql(query);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: 'Error querying database', details: error.message});
    }
});

//create a new post
posts.post('/newPost', async (req, res) => {
    const {caption, hashtag, image, postVisibility} = req.body;
    const username = req.session.username; 

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

     let s3url;
     if (image) {
        try {
            s3url = await uploadImageToS3(image);
        } catch (error) {
            console.error("Error uploading image: ", error);
            return res.status(500).json({error: 'Error uploading image'});
        }
     }
     
     const post_json = {
        username: username,
        source_site: 'g07',
        post_uuid_within_site: null, //replace with the postID of the new post
        post_text: caption,
        content_type: s3url
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
        post_json: post_json //Object, not a string
    };

    try {
        const postID = await createPost(newPostData);
        post_json.post_uuid_within_site = postID; //to update the post_uuid_within_site
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
    const postJson = JSON.parse(post[0].post_json);

    console.log("postJson " + postJson);

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
        console.error(error); // Log the error message
        res.status(500).json({error: 'Error querying database', details: error.message});
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
    const postUserID = post[0].userID;
    console.log("post[0].userID " +  postUserID);

    //get the userID from the username
    const query = `SELECT userID FROM users WHERE username = '${username}'`;
    const result = await db.send_sql(query);
    const userID = result[0].userID;

    //check if the post exists and if the userID matches
    if (post.length == 0 || postUserID != userID) {
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

    //get the userID from the username
    const query = `SELECT userID FROM users WHERE username = '${username}'`;
    const result = await db.send_sql(query);
    const userID = result[0].userID;

    //check if the user has already liked this post
    const likeQuery = `SELECT * FROM likes WHERE postID = ${postID} AND liker = '${userID}'`;
    const likeResult = await db.send_sql(likeQuery);
    if (likeResult.length > 0) {
        return res.status(400).json({ error: 'You have already liked this post.' });
    }

    try {
        await likePost(postID, userID);
        res.status(200).json({message: 'Post liked.'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database.', details: error.message});
    }
});

//comment on a post
posts.post('/commentPost/:postID', async (req, res) => {
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

    let {content, parentCommentID} = req.body;
    //check if parentCommentID is given, if not, set it to null
    if (!parentCommentID) {
        parentCommentID = null;
    }
    console.log(`content: ${content}, parentCommentID: ${parentCommentID}`);

    //check if comment is gievn
    if (!content) {
        res.status(400).json({error: 'you need to give a comment'});
        return;
    }

    const post = await db.send_sql(`SELECT * FROM posts WHERE postID = ${postID}`);
    console.log(`post: ${JSON.stringify(post)}`);

    //get the userID from the username
    const query = `SELECT userID FROM users WHERE username = '${username}'`;
    const result = await db.send_sql(query);
    const userID = result[0].userID;

    //check if the actually post exists
    if (!post || post.length == 0) {
        res.status(404).json({error: 'Post does not exist'});
        return;
    }
    try {
        await commentPost(postID, userID, content, parentCommentID);
        res.status(200).json({message: 'Comment posted.'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database.', details: error.message});
    }
});

//fetch posts recommended for a user
posts.get('/fetchRecPosts', async (req, res) => {
    // Verify the user's original username for security reasons
    const username = req.session.username; // USE req.session.username INSTEAD

    if (!username || req.session.username !== username || req.session.username == null) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }
    const query = `SELECT userID FROM users WHERE username = '${username}'`;
    const result = await db.send_sql(query);
    const userID = result[0].userID;
    try {
        const posts = await fetchPostsForUser(userID);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error querying database', details: error.message});
    }
});

export default posts;