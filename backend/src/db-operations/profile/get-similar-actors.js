import db from '../../db-setup/db_access.js';
import { getUser } from '../index.js';

const getSimilarActors = async (username) => {
    const userResult = await getUser(username);

    if (!userResult || userResult.length === 0) {
        throw new Error(`User with username ${username} not found`);
    }
    
    const userID = userResult[0].userID;

    // Query to retrieve actor_nconst_short associated with the userID
    const query = `SELECT actor_nconst_short FROM users2actors WHERE userID = ${userID}`;
    const results = await db.send_sql(query);

    // Extract actor_nconst_short from the results and return as an array
    const similarActors = results.map(row => row.actor_nconst_short);
    
    return similarActors;
};

export default getSimilarActors;
