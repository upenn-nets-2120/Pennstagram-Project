import db from '../../rds-setup/db_access.js';
import {
    getUser
} from '../index.js';

const deleteSimilarActors = async (username) => {
    // Step 1: Retrieve the userID for the given username
    const userResult = await getUser(username);
    const userID = userResult[0].userID;

    const deleteQuery = 'DELETE FROM users2actors WHERE userID = ?';
    const result = await db.send_sql(deleteQuery, [userID]);

    console.log(`Deleted ${result.affectedRows} entries from 'users2actors' for user ${username} (userID: ${userID}).`);
    return result;
};

export default deleteSimilarActors;