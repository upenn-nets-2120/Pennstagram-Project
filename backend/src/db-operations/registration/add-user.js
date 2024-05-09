import db from '../../db-setup/db_access.js';

const addUser = async (username, password, email, affiliation, birthday) => {
    console.log("addUser's password param:", password);

    const sql = `INSERT INTO users (username, salted_password, emailID, affiliation, birthday)
                 VALUES ('${username}', '${password}', '${email}', '${affiliation}', '${birthday}')`;

    return await db.send_sql(sql);
}


export default addUser;
