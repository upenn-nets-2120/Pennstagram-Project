import db from '../../../database/db_access';

const getChatsFromUser = async (userID) => {
    const sql = `
        SELECT
            chats.*
        FROM
            chats
        JOIN
            users2chats ON chats.chatID = users2chats.chatID
        WHERE
            users2chats.userID = ${userID};
    `;

    return await db.send_sql(sql);
}

export default getChatsFromUser;
