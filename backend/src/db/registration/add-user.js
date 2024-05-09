import db from '../../../database/db_access.js';

const addUser = async (username, password, email, affiliation, birthday) => {
    console.log("addUser's password param:", password);

    const sql = `INSERT INTO users (username, salted_password, emailID, affiliation, birthday)
                 VALUES ('${username}', '${password}', '${email}', '${affiliation}', '${birthday}')`;

    return await db.insert_items(sql);
}


export default addUser;
