import db from '../../db-setup/db_access.js';

const getFollowersFromUser = async (userID) => {
    const sql = `
        SELECT
            users.*,
            CASE
                WHEN friends2.follower IS NULL THEN 0
                ELSE 1
            END AS follows_back,
            CASE
                WHEN requests.userID IS NULL THEN 0
                ELSE 1
            END AS requested,
            CASE
                WHEN TIMESTAMPDIFF(MINUTE, users.lastOnline, NOW()) <= 100 THEN 1
                ELSE 0
            END AS within_10_minutes
        FROM
            friends
        JOIN
            users ON friends.follower = users.userID
        LEFT JOIN
            friends friends2 ON friends2.follower = '${userID}' AND friends2.followed = friends.follower
        LEFT JOIN
            requests ON requests.requesting = friends.followed AND requests.userID = friends.follower
        WHERE
            friends.followed = '${userID}'
    ;`;

    return await db.send_sql(sql);
}

export default getFollowersFromUser;
