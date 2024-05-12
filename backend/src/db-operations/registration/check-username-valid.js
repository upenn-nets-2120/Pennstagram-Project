import authUtils from '../../utils/authUtils.js';
import db from '../../db-setup/db_access.js';

const checkUsernameValid = async (username) => {

    const query = `SELECT * 
                   FROM users
                   WHERE username = '${username}'`;
    const result = await db.send_sql(query);

    return result.length === 0;
};

export default checkUsernameValid;
