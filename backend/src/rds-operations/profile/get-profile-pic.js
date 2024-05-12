import db from '../../rds-setup/db_access.js';

const getProfilePic = async (username) => {
    // retrieve user profile photo from username
    const result = await db.send_sql(`SELECT userProfilePic from users
                                      WHERE username = '${username}';`);
    return result;
};

export default getProfilePic;
