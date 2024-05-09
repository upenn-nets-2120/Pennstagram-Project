import db from '../../db-setup/db_access.js';
import {
    getUser
} from '../index.js';

const modifySimilarActors = async (username, similarActors) => {
    const userResult = await getUser(username);
    const userID = userResult[0].userID;

    // Insert new similar actor links
    const insertQuery = 'INSERT INTO users2actors (userID, actor_nconst_short) VALUES ?';
    const values = similarActors.map(actorList => 
       actorList.map(actor => [userID, actor.id.split('-')[0]]) // Assuming actor ID format includes nconst
    ).flat();
     
    let result;
    if (values.length > 0) {
         result = await db.send_sql(insertQuery, [values]);
         console.log(`Updated similar actors for user ${username}`);
    } else {
        result = { error: "updating simliar actors did not work; couldn't parse the return from main() in app.js of similarActors calculations."};
    }

    return result;
};

export default modifySimilarActors;