import db from '../../database/db_access';

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