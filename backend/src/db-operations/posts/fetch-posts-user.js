import db from '../../db-setup/db_access.js';

//signle hashtage in each hashtag column, multiple hashtags of interest per user in user_hashtags
const fetchPostsForUser = async (userID) => {
    const query = `
        SELECT p.*, pr.rank as postRank, ur.rank as userRank
        FROM posts p
        JOIN ranks pr ON p.postID = pr.id AND pr.type = 'post'
        JOIN users u ON p.userID = u.userID
        JOIN ranks ur ON u.userID = ur.id AND ur.type = 'user'
        WHERE p.userID IN (
            SELECT friendID FROM friends WHERE userID = ${userID}
        ) OR p.hashtag IN (
            SELECT hashtag FROM user_hashtags WHERE userID = ${userID}
        )
        ORDER BY postRank DESC, userRank DESC, p.timeStamp DESC;
    `;
    return await db.send_sql(query);
};

/*double check this logic
joins the posts table with the ranks table
1) get the ranks of posts (pr.rank)
2) get the ranks of users (ur.rank)

select posts where the userID is a friend of the given user or the hashtag is one of the user's selected hashtags of interest
order the results first by post rank, then by user rank, and then by timestamp
*/

export default fetchPostsForUser;
