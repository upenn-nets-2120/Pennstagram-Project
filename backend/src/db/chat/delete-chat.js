import db from '../../../database/db_access.js';

const deleteChat = async (chatID) => {
    const sql = `
        DELETE FROM
            chats
        WHERE
            chatID = '${chatID}'
    ;`;

    return await db.send_sql(sql);
}

export default deleteChat;
