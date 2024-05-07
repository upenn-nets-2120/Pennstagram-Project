import db from '../../database/db_access';
const helper = require('../../utils/route_helper');


const addUser = async ({ username, password, email, affiliation, birthday }) => {

    helper.encryptPassword(password, async (err, hash) => {
        if (err) {
            return res.status(500).json({error: 'Error encrypting password.'});
        }
        const sql = `INSERT INTO users (username, hashed_password, email, affiliation, birthday)
         VALUES ('${username}', '${hash}', '${email}', '${affiliation}', '${birthday}')`;

    return await db.insert_items(sql);
    });
}


export { addUser };
