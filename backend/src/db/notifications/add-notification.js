import db from '../../../database/db_access.js';

const addNotification = async (userID, type, content) => {
    const sql = `
        INSERT INTO
            notifications (userID, type, content)
        VALUES 
            (${userID}', '${type}', '${content}')
    ;`;

    return await db.insert_items(sql);
}

export default addNotification;