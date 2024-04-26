import db from '../../database/db_access';

const getFollowersFromUser = async (userID) => {
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

export default getFollowersFromUser;