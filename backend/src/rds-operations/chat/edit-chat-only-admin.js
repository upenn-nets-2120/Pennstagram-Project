import db from '../../rds-setup/db_access.js';

const editChatOnlyAdmin = async (chatID, onlyAdmins) => {
    const sql = `
        UPDATE
            chats
        SET
            onlyAdmins = ${onlyAdmins ? 1 : 0}
        WHERE
            chatID = '${chatID}'
    ;`;

    return await db.send_sql(sql);
}

export default editChatOnlyAdmin;
