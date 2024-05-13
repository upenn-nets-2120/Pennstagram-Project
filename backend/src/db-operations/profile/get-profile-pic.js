import db from '../../db-setup/db_access.js';

const getProfilePic = async (username) => {
    // retrieve user profile photo from username
    const fullS3URL = await db.send_sql(`SELECT profilePicURL from users
                                      WHERE username = '${username}';`);
    return fullS3URL[0].profilePicURL;
};

export default getProfilePic;
