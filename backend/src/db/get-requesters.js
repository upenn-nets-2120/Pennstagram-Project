const getRequestersFromUser = async (userID) => {
    const sql = `
        SELECT
            *
        FROM
            requests
        JOIN
            users ON requests.userID = users.userID
        WHERE
            requests.requesting = '${userID}'
    ;`;

    return await db.send_sql(sql);
}

export default getRequestersFromUser;