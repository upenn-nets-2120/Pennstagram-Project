import db from '../../database/db_access';

const getRecommendationsFromUser = async (userID) => {
    const sql = `
        SELECT
            *
        FROM
            friends
        JOIN
            users ON friends.follower = users.userID
        WHERE
            friends.followed = '${userID}'
    ;`;

    return await db.send_sql(sql);
}

export default getRecommendationsFromUser;