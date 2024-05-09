import db from '../../db-setup/db_access.js';
import {
    getUser
} from '../index.js';

const getSimilarActors = async (username) => {
    const userResult = await getUser(username);
    const userID = userResult[0].userID;

    const result = await db.send_sql(`SELECT actor_nconst_short FROM users2actors
                                      WHERE userID = ?`, [userID]);
    return result;
};

export default getSimilarActors;
