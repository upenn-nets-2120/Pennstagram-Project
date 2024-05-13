import db from '../../db-setup/db_access.js';

const getUserByNConst = async (nconstID) => {
    const sql = `
        SELECT *
        FROM users
        WHERE linked_actor_nconst = '${nconstID}'
    ;`;

    return await db.send_sql(sql);
}

export default getUserByNConst;
