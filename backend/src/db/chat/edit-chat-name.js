import db from '../../../database/db_access';

const editChatName = async (chatID, name) => {
    const sql = `
        UPDATE
            chats
        SET
            name = '${name}',
        WHERE
            chatID = '${chatID}'
    ;`;

    return await db.send_sql(sql);
}

export default editChatName;
