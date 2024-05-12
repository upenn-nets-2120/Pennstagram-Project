import db from '../../rds-setup/db_access.js';

const updateProfilePhoto = async (username, profilePhoto) => {
    const sql = `
        UPDATE users
        SET profilePhoto = '${profilePhoto}'
        WHERE username = '${username}'
    ;`;

    return await db.update_items(sql);
}


export default updateProfilePhoto;
