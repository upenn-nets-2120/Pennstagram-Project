// for Sem to fill in later, but checkUsernameValid() is used by profile to check if a new username is valid
import authUtils from '../utils/authUtils.js';

const checkUsernameValid = async (username) => {

    const query = `SELECT * 
                   FROM users
                   WHERE username = ?`;
    const result = await db.send_sql(query, [username]);

    console.log(result[0].length);

    if (result[0].length === 0) {
        // add any username restrictions here, right now I just have that it should be longer than ''
        return authUtils.isOK(username);
    } 
    return false;
};

export default {
    checkUsernameValid,
};
