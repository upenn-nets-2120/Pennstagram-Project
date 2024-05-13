// import db from '../../db-setup/db_access.js';

// const getRecommendationsFromUser = async (userID) => {
//     const sql = `
//         SELECT
//             *
//         FROM
//             recommendations
//         JOIN
//             users ON recommendations.userID = users.userID
//         WHERE
//             recommendations.recommendedID = '${userID}'
//     ;`;

//     return await db.send_sql(sql);
// }

// export default getRecommendationsFromUser;

import db from '../../db-setup/db_access.js';

const getRecommendationsForUser = async (userID) => {
    const sql = `
        SELECT DISTINCT
            users.*,
            CASE
                WHEN requests.userID IS NOT NULL THEN 1
                ELSE 0
            END AS requested
        FROM
            friends
        JOIN
            friends friends2 ON friends.followed = friends2.follower
        JOIN
            users ON users.userID = friends2.followed
        LEFT JOIN
            requests ON requests.requesting = '${userID}' AND requests.userID = users.userID
        WHERE
            friends.follower = '${userID}'
        AND
            '${userID}' != users.userID
        AND
            users.userID NOT IN (SELECT followed FROM friends WHERE follower = '${userID}')
    ;`;
    // const sql = `
    //     SELECT DISTINCT
    //         users.*,
    //         CASE
    //             WHEN requests.userID IS NOT NULL THEN 1
    //             ELSE 0
    //         END AS requested
    //     FROM
    //         users
    //     JOIN
    //         friends AS recommended_followers ON recommended_followers.followed = users.userID
    //     LEFT JOIN
    //         friends AS user_followings ON user_followings.followed = recommended_followers.follower AND user_followings.follower = '${userID}'
    //     LEFT JOIN
    //         requests ON requests.requesting = '${userID}' AND requests.userID = users.userID
    //     WHERE
    //         users.userID != '${userID}' AND user_followings.follower IS NULL AND users.userID NOT IN (SELECT followed FROM friends WHERE follower = '${userID}')
    // ;`;
    
    return await db.send_sql(sql);
}

export default getRecommendationsForUser;
