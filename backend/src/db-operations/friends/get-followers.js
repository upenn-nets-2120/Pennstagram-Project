import db from '../../db-setup/db_access.js';

const getFollowersFromUser = async (userID) => {
    const sql = `
        SELECT
            users.*,
            CASE
                WHEN friends.follower IS NULL THEN 0
                ELSE 1
            END AS follows_back,
            CASE
                WHEN requests.userID IS NULL THEN 0
                ELSE 1
            END AS requested
        FROM
            users
        LEFT JOIN
            friends ON friends.follower = users.userID AND friends.followed = '${userID}'
        LEFT JOIN
            requests ON requests.requesting = '${userID}' AND requests.userID = users.userID
        WHERE
            friends.followed = '${userID}'
    ;`;
    
    return await db.send_sql(sql);
}

export default getFollowersFromUser;
