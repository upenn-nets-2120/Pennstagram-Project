import db from '../../rds-setup/db_access.js';

const deleteMessage = async (messageID) => {
    const sql = `
        DELETE FROM
            messages
        WHERE
            messageID = '${messageID}'
    ;`;

    return await db.send_sql(sql);
}

export default deleteMessage;
