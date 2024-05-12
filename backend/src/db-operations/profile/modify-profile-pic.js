import db from '../../db-setup/db_access.js';
import {
    deleteSimilarActors,
    calculateFaceMatches,
    modifySimilarActors
} from '../index.js';

// automatically recomputes the similarActors and stores them with the associated user in users2actors
const modifyProfilePic = async (username, profilePic) => {
    // retrieve user profile photo from username
    const modifyResult = await db.send_sql(`UPDATE users SET userProfilePic = ? WHERE username = ?`, [profilePic, username]);

    // delete previous similar actors
    const deleteResult = await deleteSimilarActors(username);

    // recalculate similar actors
    const recalculateResult = await calculateFaceMatches(username);

    // set similar actors in database
    const setSimilarResult = await modifySimilarActors(username, recalculateResult);
    return { modify: modifyResult, delete: deleteResult, recalculate: recalculateResult, setSimilar: setSimilarResult};
};

export default modifyProfilePic;