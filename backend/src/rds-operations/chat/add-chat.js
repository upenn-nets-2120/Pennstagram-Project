import db from '../../rds-setup/db_access.js';

const addChat = async (name, description, profilePic, onlyAdmins) => {
    const sql = `
        INSERT INTO
            chats (name, description, profilePic, onlyAdmins)
        VALUES 
            ('${name}', '${description}', '${profilePic}', ${onlyAdmins ? 1 : 0})
    ;`;

    return await db.insert_items(sql);
}

export default addChat;
