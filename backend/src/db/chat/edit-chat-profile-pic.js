import db from '../../../database/db_access';

const editChatProfilePic = async (chatID, profilePic) => {
    const sql = `
        UPDATE
            chats
        SET
            profilePic = '${profilePic}',
        WHERE
            chatID = '${chatID}'
    ;`;

    return await db.send_sql(sql);
}

export default editChatProfilePic;
