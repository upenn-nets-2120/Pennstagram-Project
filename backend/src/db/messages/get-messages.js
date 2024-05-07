import db from '../../../database/db_access';

const getMessagesFromChat = async (chatID) => {
    const sql = `
        SELECT
            *
        FROM
            messages
        WHERE
            chatID = ${chatID}
        ORDER BY
            timestamp ASC;
    `;

    return await db.send_sql(sql);
}

export default getMessagesFromChat;
