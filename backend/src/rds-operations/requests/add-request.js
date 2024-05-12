import db from '../../rds-setup/db_access.js';

const addRequest = async (userID, requesting) => {
    const sql = `
        INSERT INTO
            requests (userID, requesting)
        VALUES 
            (${userID}', '${requesting}')
    ;`;

    return await db.insert_items(sql);
}

export default addRequest;