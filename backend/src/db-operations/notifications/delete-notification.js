import db from '../../db-setup/db_access.js';

const deleteNotifications = async (notificationsID) => {
    const sql = `
        DELETE FROM
            notifications
        WHERE
            notificationsID = '${notificationsID}'
    ;`;

    return await db.send_sql(sql);
}

export default deleteNotifications;