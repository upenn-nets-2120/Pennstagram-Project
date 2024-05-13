import db from '../../db-setup/db_access.js';

const getUsersFromChat = async (chatID) => {
    const sql = `
        SELECT
            users.*
        FROM
            users
        JOIN
            users2chats ON users2chats.userID = users.userID
        WHERE
            users2chats.chatID = '${chatID}'
    ;`;

    return await db.send_sql(sql);
}

export default getUsersFromChat;
