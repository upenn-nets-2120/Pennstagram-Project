import db from '../../db-setup/db_access.js';

const deleteChat = async (userID, chatID) => {
    const sql = `
        DELETE FROM
            users2chats
        WHERE
            userID = '${userID}' AND chatID = '${chatID}'
    ;`;

    return await db.send_sql(sql);
}

export default deleteChat;
