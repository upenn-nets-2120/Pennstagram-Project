import db from '../../db-setup/db_access.js';

const addMessage = async (userID, chatID, content) => {
    const sql = `
        INSERT INTO
            messages (userID, chatID, content)
        VALUES 
            ('${userID}', ${chatID}, '${content}')
    ;`;

    return await db.insert_items(sql);
}

export default addMessage;
