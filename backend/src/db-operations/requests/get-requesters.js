import db from '../../db-setup/db_access.js';

const getRequestersFromUser = async (userID) => {
    const sql = `
        SELECT
            *
        FROM
            requests
        JOIN
            users ON requests.requesting = users.userID
        WHERE
            requests.userID = '${userID}'
    ;`;

    return await db.send_sql(sql);
}

export default getRequestersFromUser;