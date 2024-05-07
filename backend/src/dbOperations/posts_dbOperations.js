import db from '../database/db_access.js'; 

export const createPost = async (newPost) => {
    const query = `
        INSERT INTO posts (image, caption, hashtag, postVisibility, post_json)
        VALUES (?, ?, ?, ?, ?)
    `;
    const postID = await db.send_sql(query, [newPost.image, newPost.caption, newPost.hashtag, newPost.postVisibility, JSON.stringify(newPost.post_json)]);
    if (newPost.hashtag) {
        await linkHashtagsToPost(newPost.hashtag, postId);
    }
    return postID;
    //return the ID of new post?
};

const linkHashtagsToPost = async (hashtags, postId) => {
    const query = `INSERT INTO posts2hashtags (postID, hashtag) VALUES (?, ?)`;
    hashtags.forEach(async (hashtag) => {
        await db.send_sql(query, [postId, hashtag]);
    });
}; 

export const updatePost = async (postID, caption, hashtag, image, postVisibility, post_json) => {
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
};

export const deletePost = async (postID) => {
    const query = `DELETE FROM posts WHERE postID = ?`;
    return await db.send_sql(query, postID);
}

export const likePost = async (postID, userID) => {
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

function extractHashtags(text) {
    return text.match(/#\w+/g) || [];
}

//signle hashtage in each hashtag column, multiple hashtags of interest per user in user_hashtags
export const fetchPostsForUser = async (userID) => {
    const query = `
        SELECT p.* FROM posts p
        JOIN recommendations r ON p.postID = r.recommendedID
        WHERE r.userID = ?
        ORDER BY p.timeStamp DESC;
    `;
    return await db.send_sql(query, [userID]);
};

//count how many times each hashtage is in the posts2hashtags table and limit to top 10
export const fetchTopHashtags = async () => {
    const query = `
        SELECT hashtag, COUNT(*) as usageCount
        FROM posts2hashtags
        GROUP BY hashtag
        ORDER BY usageCount DESC
        LIMIT 10;
    `;
    return await db.send_sql(query);
};
