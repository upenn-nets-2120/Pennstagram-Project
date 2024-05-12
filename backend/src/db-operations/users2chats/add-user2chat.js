import db from '../../db-setup/db_access.js';

const addUser2Chat = async (userID, chatID, isAdmin) => {
    const sql = `
        INSERT INTO
            users2chats (userID, chatID, isAdmin)
        VALUES 
            ('${userID}', '${chatID}', ${isAdmin ? 1 : 0})
    ;`;

    return await db.insert_items(sql);
}

export default addUser2Chat;
