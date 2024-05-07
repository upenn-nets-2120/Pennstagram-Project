import express from 'express';
import db from '../../database/db_access.js';

const posts = express.Router();

//fetch all posts
posts.get('/fetch', async (req, res) => {
    const posts = await db.send_sql('SELECT * FROM posts;');
    res.json(posts);
});

//create a new post
posts.post('/new', async (req, res) => {
    const {caption, hashtag, image, postVisibility} = req.body;
    const username = req.session.username;

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
     
     const newPost = {caption, hashtag, image, postVisibility, username};
     newPost.username = username; //add username to be associate with the newPost
     await db.send_sql('INSERT INTO posts SET ?', newPost);
    res.status(200).json({message: 'post created successfully'});
});

//update a post
posts.put('/:postID/update', async (req, res) => {
    const {postID} = req.params;
    const {caption, hashtag, image, postVisibility} = req.body;
    const username = req.session.username;

    //check if at least one of caption, hashtag, image, or visibility is provided
    if (!(caption || hashtag || image || postVisibility)) {
        res.status(400).json({error: 'at least one of following must be prvoided: caption, hashtag, image, or visibility must be provided'});
        return;
    }

    //get the post from the database
    const post = await db.send_sql('SELECT * FROM posts WHERE postID = ?', postID);

    //check if the post exists and if the username matches
    if (!post || post.username !== username) {
        res.status(403).json({ error: 'post does not exist or not your post  to delete'});
        return;
    }  
    const updatedPost = {caption, hashtag, image, postVisibility};
    await db.send_sql('UPDATE posts SET ? WHERE postID = ?', [updatedPost, postID]); //SET caption, hashtag to some new value
    res.status(200).json({ message: 'post updated successfully' });
});

//delete a post
posts.delete('/:postID/delete', async (req, res) => {
    const {postID} = req.params;
    const username = req.session.username;

    //get the post from the database
    const post = await db.send_sql('SELECT * FROM posts WHERE postID = ?', postID);

    //check if the post exists and if the username matches
    if (!post || post.username !== username) {
        res.status(403).json({ error: 'post does not exist or not your post  to delete'});
        return;
    }   
    await db.send_sql('DELETE FROM posts WHERE postID = ?', postID);
    res.status(200).json({ message: 'post deleted successfully' });
});

//like a post
posts.post('/:postID/like', async (req, res) => {
    const {postID} = req.params; //postID
    const userID = req.body.userID; //userID of the user who likes the post?
    //insert a new like into the likes table
    await db.send_sql('INSERT INTO likes SET postID = ?, liker = ?', [postID, userID]);
    res.status(200).json({ message: 'post liked successfully' });
});

//comment on a post
posts.post('/:postID/comments', async (req, res) => {
    const {postID} = req.params;
    const comment = req.body.comment;
    const username = req.session.username;

    //check if comment is gievn
    if (!comment) {
        res.status(400).json({error: 'you need to give a comment'});
        return;
    }

    //get the post from the database
    const post = await db.send_sql('SELECT * FROM posts WHERE postID = ?', postID);

    //check if the actually post exists
    if (!post) {
        res.status(404).json({error: 'Post does not exist'});
        return;
    }

    //insert the new comment into the database
    const newComment = { postID, username, comment };
    await db.send_sql('INSERT INTO comments SET ?', newComment);
    res.status(200).json({message: 'comment posted successfully'});
});

export default posts;