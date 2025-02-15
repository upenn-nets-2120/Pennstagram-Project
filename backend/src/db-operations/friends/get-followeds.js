import db from '../../db-setup/db_access.js';

const getFollowedsFromUser = async (userID) => {
    const sql = `
        SELECT
            *,
            1 AS follows_back,
            0 AS requested
        FROM
            friends
        JOIN
            users ON friends.followed = users.userID
        LEFT JOIN
            friends friends2 ON friends.followed = friends2.follower AND friends.follower = friends2.followed
        WHERE
            friends.follower = '${userID}'
    ;`;

    return await db.send_sql(sql);
}

export default getFollowedsFromUser;