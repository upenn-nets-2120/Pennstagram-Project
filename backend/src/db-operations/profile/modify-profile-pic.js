import db from '../../db-setup/db_access.js';
import {
    deleteSimilarActors,
    calculateFaceMatches,
    modifySimilarActors
} from '../index.js';
import { uploadImageToS3 } from '../../db-operations/s3-operations/index.js';

// automatically recomputes the similarActors and stores them with the associated user in users2actors
const modifyProfilePic = async (username, profilePic) => {
    // upload new profile picture to s3
    const newProfilePicURL = await uploadImageToS3(profilePic, false); // true for post images, false for profile images

    // replace the old profile picture URL in RDS with new URL
    const modifyRDSResult = await db.send_sql(`UPDATE users SET profilePicURL = '${newProfilePicURL}' WHERE username = '${username}'`);

    // delete previous similar actors
    const deleteResult = await deleteSimilarActors(username);

    // recalculate similar actors
    const recalculateResult  = await calculateFaceMatches(username);

    // set similar actors in database
    const setSimilarResult = await modifySimilarActors(username, recalculateResult.top_matches);

    return { modify: modifyRDSResult.message, delete: deleteResult.affectedRows, recalculate: recalculateResult, setSimilar: setSimilarResult.affectedRows };
};

export default modifyProfilePic;