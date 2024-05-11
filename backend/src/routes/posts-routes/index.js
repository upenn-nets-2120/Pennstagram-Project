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

    console.log("Caption: ", caption);

    try {
        if (authUtils.isOK(caption)) {
            console.log("checked is okay");
        }
        if (!authUtils.isOK(caption)) {
            console.log("caption is not okay");
        }
    } catch (error) {
        console.error("Error in isOK function: ", error); // Log any error from the isOK function
    }

    //check if at least one of caption, hashtag, or image is provided
    if (!((authUtils.isOK(caption) || authUtils.isOK(hashtag) || authUtils.isOK(image)))) {
        return res.status(400).json({error: 'at least one of caption, hashtag, or image must be provided OR one or more of your inputs is potentially an SQL injection attack'});
    }
    // Verify the user's original username for security reasons
    if (!req.session || req.session.username !== username) {
        return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
    }

    //check if postVisibility is provided
    if (!postVisibility) {
        res.status(400).json({error: 'postVisibility is required'});
        return;
     }
     
     const post_json = {
        username: username,
        source_site: 'g07',
        post_uuid_within_site: null, // replace with the postID of the new post
        post_text: caption,
        content_type: 'BLOB'
    };

    const newPost = {username, caption, hashtag, image, postVisibility, post_json: JSON.stringify(post_json)};
    //const newPostParams = [caption, hashtag, image, postVisibility, userID];
    //const sql = 'INSERT INTO posts (caption, hashtag, image, postVisibility, nconstID) VALUES (?, ?, ?, ?, ?)'; 
    try {
        //await createPost(newPost);
        //await db.send_sql(sql, newPostParams);
        const postID = await createPost(newPost);
        post_json.post_uuid_within_site = postID;
        newPost.post_json = JSON.stringify(post_json);
        await updatePostJson(postID, newPost.post_json);        
        res.status(201).json({message: 'Post created', postID: postID});
    } catch (error) {
        res.status(500).json({error: 'Error querying database', details: error.message});
    }
});

const updatePostJson = async (postID, post_json) => {
    const query = `
        UPDATE posts
        SET post_json = ?
        WHERE postID = ?
    `;
    await db.send_sql(query, [post_json, postID]);
};

//update a post
posts.put('/updatePost', async (req, res) => {
    const {postID, post_json} = req.params;
    const {caption, hashtag, image, postVisibility} = req.body;
    const userID = req.session.userID; // USE req.session.username INSTEAD

    //check if at least one of caption, hashtag, image, or visibility is provided
    if (!(caption || hashtag || image || postVisibility)) {
        res.status(400).json({error: 'at least one of following must be prvoided: caption, hashtag, image, or visibility must be provided'});
        return;
    }

    //get the post from the database
    const post = await db.send_sql('SELECT 1 FROM posts WHERE postID = ?', postID);

    //check if the post exists and if the userID matches
    if (!post || post.userID !== userID) {
        res.status(403).json({ error: 'post does not exist or it is not your post  to delete'});
        return;
    }  
    try {
        await updatePost(postID, userID, caption, hashtag, image, postVisibility, post_json);
        res.status(200).json({message: 'Post updated'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database'});
    }
});

//delete a post
posts.delete('/deletePost', async (req, res) => {
    const {postID} = req.params;
    const userID = req.session.userID; // USE req.session.username INSTEAD

    //get the post from the database
    const post = await db.send_sql('SELECT * FROM posts WHERE postID = ?', postID);

    //check if the post exists and if the userID matches
    if (!post || post.userID !== userID) {
        res.status(403).json({ error: 'post does not exist or not your post to delete'});
        return;
    }   
    //const sql = 'DELETE FROM posts WHERE postID = ?'; 
    try {
        //await db.send_sql(sql, postID);
        await deletePost(postID);
        res.status(200).json({message: 'Post deleted.'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database.'});
    }
});

//like a post
posts.post('/likePost', async (req, res) => {
    const {postID} = req.params; //postID
    const userID = req.body.userID; //userID of the user who likes the post? // USE req.session.username INSTEAD
    //insert a new like into the likes table
    //const sql = 'INSERT INTO likes (postID, liker) VALUES (?, ?)'; 
    try {
        //await db.send_sql(sql, [postID, userID]);
        await likePost(postID, userID);
        res.status(200).json({message: 'Post liked.'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database.'});
    }
    res.status(200).json({ message: 'post liked successfully' });
});

//comment on a post
posts.post('/commentPost', async (req, res) => {
    const {postID} = req.params;
    const {comment, parentCommentID} = req.body;
    const userID = req.session.userID; // USE req.session.username INSTEAD

    //check if comment is gievn
    if (!comment) {
        res.status(400).json({error: 'you need to give a comment'});
        return;
    }

    const post = await db.send_sql('SELECT * FROM posts WHERE postID = ?', postID);

    //check if the actually post exists
    if (!post) {
        res.status(404).json({error: 'Post does not exist'});
        return;
    }

    //const newCommentParams = [postID, userID, comment, (parentCommentID || null)];
    //const sql = 'INSERT INTO comments (postID, userID, comment, parentCommentID) VALUES (?, ?, ?, ?)'; 
    try {
        await commentPost(postID, userID, comment, parentCommentID);
        //await db.send_sql(sql, newCommentParams);
        res.status(200).json({message: 'Comment posted.'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database.'});
    }
});

//fetch posts recommended for a user
posts.get('/fetchPosts', async (req, res) => {
    try {
        const posts = await fetchPostsForUser(req.params.userID);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error querying database' });
    }
});

export default posts;