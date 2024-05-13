import db from '../../db-setup/db_access.js';
import { getUser } from '../index.js';

const modifySimilarActors = async (username, similarActors) => {
    const userResult = await getUser(username);
    const userID = userResult[0].userID;

    // Build the values part of the SQL query using template literals
    const values = similarActors.map(actor => `(${userID}, '${actor.actor_nconst}')`).join(', ');

    let result;
    if (values.length > 0) {
        const insertQuery = `INSERT INTO users2actors (userID, actor_nconst_short) VALUES ${values}`;
        result = await db.send_sql(insertQuery);
        console.log(`Updated similar actors for user ${username}`);
    } else {
        result = { error: "Updating similar actors did not work; couldn't parse the return from main() in app.js of similarActors calculations." };
    }

    return result;
};

export default modifySimilarActors;
