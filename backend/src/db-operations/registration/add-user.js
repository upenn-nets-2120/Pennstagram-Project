import db from '../../db-setup/db_access.js';

const addUser = async (username, password, email, affiliation, birthday, userVisibility) => {
    console.log("addUser's password param:", password);

    const sql = `INSERT INTO users (username, salted_password, emailID, affiliation, birthday, userVisibility)
                 VALUES ('${username}', '${password}', '${email}', '${affiliation}', '${birthday}', '${userVisibility}')`;

    return await db.insert_items(sql);
}


export default addUser;
