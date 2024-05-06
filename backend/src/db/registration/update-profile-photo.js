import db from '../../database/db_access';

const updateProfilePhoto = async (username, profilePhoto) => {
    const sql = `
        UPDATE users
        SET profilePhoto = '${profilePhoto}'
        WHERE username = '${username}'
    ;`;

    return await db.update_items(sql);
}


export { updateProfilePhoto };
