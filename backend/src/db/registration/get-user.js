import db from '../../database/db_access';

const getUser = async (username, email) => {
    const sql = `
        SELECT *
        FROM users
        WHERE username = '${username}' OR email = '${email}'
    ;`;

    return await db.query(sql);
}

export { getUser };
