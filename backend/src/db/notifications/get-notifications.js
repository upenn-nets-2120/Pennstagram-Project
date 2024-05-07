import db from '../../../database/db_access.js';

const getNotificationsFromUser = async (userID) => {
    const sql = `
        SELECT
            *
        FROM
            notifications
        WHERE
            friends.followed = '${userID}'
    ;`;

    return await db.send_sql(sql);
}

export default getNotificationsFromUser;