import db from '../../database/db_access.js';

const linkHashtagsToPost = async (hashtags, postId) => {
    const insertHashtagQuery = `INSERT IGNORE INTO hashtags (hashtag) VALUES (?)`;
    const getHashtagIdQuery = `SELECT hashtagID FROM hashtags WHERE hashtag = ?`;
    const linkHashtagToPostQuery = `INSERT INTO posts2hashtags (postID, hashtagID) VALUES (?, ?)`;

    for (const hashtag of hashtags) {
        //add the hashtag to the hashtags table, ignoring the insert if it already exists
        await db.send_sql(insertHashtagQuery, [hashtag]);

        //get the ID of the hashtag
        const results = await db.send_sql(getHashtagIdQuery, [hashtag]);
        const hashtagId = results[0].hashtagID;

        //link the post to the hashtag
        await db.send_sql(linkHashtagToPostQuery, [postId, hashtagId]);
    }
};

//return an array of hashtags
function extractHashtags(text) {
    return text.match(/#\w+/g) || [];
}

export const createPost = async (newPost) => {
    const query = `
        INSERT INTO posts (userID, image, caption, postVisibility, post_json)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const postID = await db.send_sql(query, [userID, newPost.image, newPost.caption, newPost.hashtag, newPost.postVisibility, JSON.stringify(newPost.post_json)]);
    
    //check if hashtag propery exists
    let hashtags = newPost.hashtag ? newPost.hashtag.split(' ') : [];
    if (newPost.caption.includes('#')) {
        //if the caption does contain hashtags, extracts them using the extractHashtags function.
        //these extracted hashtags are then added to the hashtags array
        hashtags = [...hashtags, ...extractHashtags(newPost.caption)];
    }
    if (hashtags.length > 0) {
        //link hashtags to the new post
        await linkHashtagsToPost(hashtags, postID);
    }
    return postID;
    /*if (newPost.hashtag) {
        await linkHashtagsToPost(newPost.hashtag, postId);
    }
    return postID;*/
    //return the ID of new post?
};



/*export const updatePost = async (postID, caption, hashtag, image, postVisibility, post_json) => {
    if (caption) {
        return await db.send_sql('UPDATE posts caption = ? WHERE postID = ?', [caption, postID]);
    }
    if (hashtag) {
        return await db.send_sql('UPDATE posts hashtag = ? WHERE postID = ?', [hashtag, postID]);
    }
    if (image) {
        return await db.send_sql('UPDATE posts image = ? WHERE postID = ?', [image, postID]);
    }
    if (postVisibility) {
        return await db.send_sql('UPDATE posts postVisibility = ? WHERE postID = ?', [postVisibility, postID]);
    }
    if (post_json) {
        return await db.send_sql('UPDATE posts post_json = ? WHERE postID = ?', [JSON.stringify(post_json), postID]);
    }
};*/

export const updatePost = async (postID, userID, caption, hashtag, image, postVisibility, post_json) => {
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

export const deletePost = async (postID) => {
    const query = `DELETE FROM posts WHERE postID = ? AND userID = ?`;
    return await db.send_sql(query, postID);
}

export const likePost = async (postID, username) => {
    const query = `INSERT INTO likes (postID, liker) VALUES (?, ?)`;
    return await db.send_sql(query, [postID, userID]);
}

export const commentPost = async (postID, userID, comment, parentCommentID) => {
    //const newCommentParams = [postID, userID, comment, (parentCommentID || null)];
    const sql = 'INSERT INTO comments (postID, userID, comment, parentCommentID) VALUES (?, ?, ?, ?)'; 
    const commentId = await db.send_sql(sql, [postID, userID, comment, parentCommentID || null]);
    if (comment.includes('#')) {
        const extractedHashtags = extractHashtags(comment);
        linkHashtagsToPost(extractedHashtags, postID);
    }
    return commentId;
};


//signle hashtage in each hashtag column, multiple hashtags of interest per user in user_hashtags
export const fetchPostsForUser = async (userID) => {
    const query = `
    SELECT p.*, pr.rank as postRank, ur.rank as userRank, u.username
    FROM posts p
    JOIN ranks pr ON p.postID = pr.id AND pr.type = 'post'
    JOIN users u ON p.userID = u.userID
    JOIN ranks ur ON u.userID = ur.id AND ur.type = 'user'
    WHERE p.userID IN (
        SELECT friendID FROM friends WHERE userID = ?
    ) OR p.hashtag IN (
        SELECT hashtag FROM user_hashtags WHERE userID = ?
    )
    ORDER BY postRank DESC, userRank DESC, p.timeStamp DESC;
    `;
    return await db.send_sql(query, [userID, userID]);
};
/*double check this logic
joins the posts table with the ranks table
1) get the ranks of posts (pr.rank)
2) get the ranks of users (ur.rank)

select posts where the userID is a friend of the given user or the hashtag is one of the user's selected hashtags of interest
order the results first by post rank, then by user rank, and then by timestamp
*/


