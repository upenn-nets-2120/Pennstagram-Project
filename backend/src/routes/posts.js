import express from 'express';
import db from '../database/db_access.js';
import {createPost, updatePost, deletePost, likePost, commentPost} from '../dbOperations/posts_dbOperations.js';

const posts = express.Router();

//TODO: check Logged In --> use helper funtion and return true (should return when user is logged in)
//"testing if this goes through"

//fetch all posts
posts.get('/fetch', async (req, res) => {
    const posts = await db.send_sql('SELECT * FROM posts;');
    try {
        const posts = await db.send_sql(sql);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: 'Error querying database'});
    }
});

//create a new post
posts.post('/new', async (req, res) => {
    const {caption, hashtag, image, postVisibility} = req.body;
    const userID = req.session.userID;

    //check if at least one of caption, hashtag, or image is provided
    if (!(caption || hashtag || image)) {
        res.status(400).json({error: 'at least one of caption, hashtag, or image must be provided'});
        return;
    }
    //check if postVisibility is provided
    if (!postVisibility) {
        res.status(400).json({error: 'postVisibility is required'});
        return;
     }
     
     const post_json = {
        username: userID,
        source_site: 'g07', // replace with your team number
        post_uuid_within_site: postID, // replace with the postID of the new post
        post_text: caption,
        content_type: 'BLOB' // replace with the content type of the image
    };

    const newPost = {userID, caption, hashtag, image, postVisibility, post_json: JSON.stringify(post_json)};
    //const newPostParams = [caption, hashtag, image, postVisibility, userID];
    //const sql = 'INSERT INTO posts (caption, hashtag, image, postVisibility, nconstID) VALUES (?, ?, ?, ?, ?)'; 
    try {
        await createPost(newPost);
        //await db.send_sql(sql, newPostParams);
        res.status(201).json({message: 'Post created'});
    } catch (error) {
        res.status(500).json({error: 'Error querying database'});
    }
});

//update a post
posts.put('/update', async (req, res) => {
    const {postID, post_json} = req.params;
    const {caption, hashtag, image, postVisibility} = req.body;
    const userID = req.session.userID;

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
posts.delete('/delete', async (req, res) => {
    const {postID} = req.params;
    const userID = req.session.userID;

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
posts.post('/like', async (req, res) => {
    const {postID} = req.params; //postID
    const userID = req.body.userID; //userID of the user who likes the post?
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
posts.post('/comments', async (req, res) => {
    const {postID} = req.params;
    const {comment, parentCommentID} = req.body;
    const userID = req.session.userID;

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

//DO WE NEED TO FIND HASHTAGS IN A POST (here) or should this be done in the feed?

export default posts;