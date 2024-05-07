import db from '../../../database/db_access';

const addFriend = async (follower, followed) => {
    const sql = `
        INSERT INTO
            friends (follower, followed)
        VALUES 
            (${follower}', '${followed}')
    ;`;

    return await db.insert_items(sql);
}

export default addFriend;