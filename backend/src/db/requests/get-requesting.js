import db from '../../database/db_access';

const getRequestingFromUser = async (userID) => {
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

export default getRequestingFromUser;