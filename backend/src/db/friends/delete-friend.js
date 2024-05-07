import db from '../../../database/db_access.js';

const deleteFriend = async (follower, followed) => {
    const sql = `
        DELETE FROM
            friends
        WHERE
            follower = '${follower}'
        AND
            followed = '${followed}'
    ;`;

    return await db.send_sql(sql);
}

export default deleteFriend;