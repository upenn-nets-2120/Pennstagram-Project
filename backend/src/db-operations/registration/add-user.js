import db from '../../db-setup/db_access.js';

const addUser = async (username, password, email, affiliation, birthday, userVisibility, linked_actor = '') => {
    console.log("addUser's password param:", password);

    let sql;

    if (linked_actor.length > 1) {
        sql = `INSERT INTO users (username, salted_password, emailID, affiliation, birthday, userVisibility, linked_actor_nconst)
        VALUES ('${username}', '${password}', '${email}', '${affiliation}', '${birthday}', '${userVisibility}', '${linked_actor}')`;
    } else {
        sql = `INSERT INTO users (username, salted_password, emailID, affiliation, birthday, userVisibility)
        VALUES ('${username}', '${password}', '${email}', '${affiliation}', '${birthday}', '${userVisibility}')`;
    }

    return await db.insert_items(sql);
}

export default addUser;
