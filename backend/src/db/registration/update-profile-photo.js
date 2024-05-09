import db from '../../../database/db_access.js';

const updateProfilePhoto = async (username, profilePhoto) => {
    const sql = `
        UPDATE users
        SET userProfilePic = '${profilePhoto}'
        WHERE username = '${username}'
    ;`;

    return await db.update_items(sql);
}


export default updateProfilePhoto;
