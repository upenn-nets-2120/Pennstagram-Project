// database operations corresponding to profileUpdates.js backend routes
import {
    getUser
} from '../index.js';
import pkg from '../../utils/actor-face-match/app.js';
const { main } = pkg;

const calculateFaceMatches = async (username) => {
    // retrieve user profile photo from username
    const userProfilePic = await getUser(username);
    const result = await main(userProfilePic);
    return result;
};

export default calculateFaceMatches;
