import db from '../../db-setup/db_access.js';

const getNotificationsFromUser = async (userID) => {
    const sql = `
        SELECT
            *
        FROM
            notifications
        WHERE
            notifications.userID = '${userID}'
    ;`;

    return await db.send_sql(sql);
}

export default getNotificationsFromUser;