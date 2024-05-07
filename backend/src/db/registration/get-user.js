import db from '../../../database/db_access.js';

const getUser = async (username) => {
    const sql = `
        SELECT *
        FROM users
        WHERE username = '${username}'
    ;`;

    return await db.send_sql(sql);
}

export default getUser ;
