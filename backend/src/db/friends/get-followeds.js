import db from '../../../database/db_access.js';

const getFollowedsFromUser = async (userID) => {
    const sql = `
        SELECT
            *
        FROM
            friends
        JOIN
            users ON friends.followed = users.userID
        LEFT JOIN
            friends2 friends2 ON friends.followed = friends2.follower AND friends.follower = friends2.followed
        WHERE
            friends.follower = '${userID}'
    ;`;

    return await db.send_sql(sql);
}

export default getFollowedsFromUser;