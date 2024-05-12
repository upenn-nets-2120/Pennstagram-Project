import db from '../../db-setup/db_access.js';

const getMessagesFromChat = async (chatID) => {
    const sql = `
        SELECT
            *
        FROM
            messages
        JOIN
            users ON messages.userID = users.userID
        WHERE
            chatID = ${chatID}
        ORDER BY
            timestamp ASC;
    `;

    return await db.send_sql(sql);
}

export default getMessagesFromChat;
