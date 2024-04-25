import db from '../database/db_access.js'; 

export const createPost = async (newPost) => {
    const query = `
        INSERT INTO posts (image, caption, hashtag, postVisibility, post_json)
        VALUES (?, ?, ?, ?, ?)
    `;
    return db.send_sql(query, [newPost.image, newPost.caption, newPost.hashtag, newPost.postVisibility, JSON.stringify(newPost.post_json)]);
    //return the ID of new post?
};

export const updatePost = async (postID, caption, hashtag, image, postVisibility, post_json) => {
    if (caption) {
        await db.send_sql('UPDATE posts caption = ? WHERE postID = ?', [caption, postID]);
    }
    if (hashtag) {
        await db.send_sql('UPDATE posts hashtag = ? WHERE postID = ?', [hashtag, postID]);
    }
    if (image) {
        await db.send_sql('UPDATE posts image = ? WHERE postID = ?', [image, postID]);
    }
    if (postVisibility) {
        await db.send_sql('UPDATE posts postVisibility = ? WHERE postID = ?', [postVisibility, postID]);
    }
    if (post_json) {
        await db.send_sql('UPDATE posts post_json = ? WHERE postID = ?', [JSON.stringify(post_json), postID]);
    }
};

export const deletePost = async (postID) => {
    const query = `DELETE FROM posts WHERE postID = ?`;
    await db.send_sql(query, postID);
}

export const likePost = async (postID, userID) => {
    const query = `INSERT INTO likes (postID, liker) VALUES (?, ?)`;
    await db.send_sql(query, [postID, userID]);
}

export const commentPost = async (postID, username, comment, parentCommentID) => {
    const newCommentParams = [postID, username, comment, (parentCommentID || null)];
    const sql = 'INSERT INTO comments (postID, username, comment, parentCommentID) VALUES (?, ?, ?, ?)'; 
    await db.send_sql(sql, newCommentParams);
}