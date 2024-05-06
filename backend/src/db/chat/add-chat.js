import db from '../../../database/db_access';

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
