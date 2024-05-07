import db from '../../database/db_access';

const deleteRequest = async (userID, requesting) => {
    const sql = `
        DELETE FROM
            requests
        WHERE
            userID = '${userID}'
        AND
            requesting = '${requesting}'
    ;`;

    return await db.send_sql(sql);
}

export default deleteRequest;