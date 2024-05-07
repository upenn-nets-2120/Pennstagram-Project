import db from '../../../database/db_access';

const editChatDescription = async (chatID, description) => {
    const sql = `
        UPDATE
            chats
        SET
            description = '${description}',
        WHERE
            chatID = '${chatID}'
    ;`;

    return await db.send_sql(sql);
}

export default editChatDescription;
