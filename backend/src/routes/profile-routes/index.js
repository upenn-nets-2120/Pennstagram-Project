/* 
Backend routes for user story #1 for profile:

As a user, I want to be able to change my profile information (including username, email, password) 
to keep my personal details updated,without triggering a status post.
*/
import express from 'express';
import {
    checkUsernameValid,
    getUser,
    getUserHashtags,
    getProfilePic,
    getSimilarActors,
    modifyUser,
    modifyUserHashtag,
    modifyProfilePic,
    modifyLinkedActor,
    getTopHashtagsSem,
    getUserByNConst
} from '../../db-operations/index.js';
import authUtils from '../../utils/authUtils.js';
import multer from 'multer';

const profile = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// used for getting profile information by nconst
profile.get('/fetchProfileByNConst', async (req, res) => {
    
    try {
        // Assuming 'username' is stored in the session upon login
        const nconst = req.body.nconst;
        
        if (!authUtils.isOK(nconst)) {
            return res.status(403).json({ error: 'you forgot nconst OR One or more of your inputs is potentially an SQL injection attack.' });
        }
        
        userProfileData = await getUserByNConst(nconst);
    
        if (!userProfileData) {
            return res.status(404).json({ error: 'User profile data not found.' });
        }

        return res.status(200).json(userProfileData[0]);
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        res.status(500).json({ error: `Internal Server ${error}` });;
    }
});

// used for getting regular text profile information
profile.get('/fetchProfile', async (req, res) => {
    
    try {
        // Assuming 'username' is stored in the session upon login
        const username = req.session.username;

        if (!username) {
            return res.status(401).json({ error: 'User is not yet authenticated' });
        }
        
        if (!authUtils.isOK(username)) {
            return res.status(403).json({ error: 'One or more of your inputs is potentially an SQL injection attack.' });
        }

        let userProfileData;
        let userHashtagData;
        let mostPopularHashtagData;
        
        userProfileData = await getUser(username);
        userHashtagData = await getUserHashtags(username);
        mostPopularHashtagData = await getTopHashtagsSem(10);

        if (!userProfileData) {
            return res.status(404).json({ error: 'User profile data not found.' });
        }

        let returnObject = { userProfile: userProfileData[0], mostPopularHashtags: mostPopularHashtagData };

        if (userHashtagData) {
            returnObject['userHashtags'] = userHashtagData[0];
        } 

        return res.status(200).json(returnObject);
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        res.status(500).json({ error: `Internal Server ${error}` });;
    }
});

// just for profile pic!!
profile.get('/fetchProfilePic', async (req, res) => {
    try {
        const username = req.session.username;
        const { desiredUsername } = req.body;

        if (!username) {
            return res.status(401).json({ error: 'User is not yet authenticated' });
        }
        if (!desiredUsername) {
            return res.status(403).json({ error: 'no input for desiredUsername received' });
        }
        if (!authUtils.isOK(desiredUsername)) {
            return res.status(403).json({ error: 'Potential SQL injection detected.' });
        }

        const result = await getProfilePic(desiredUsername);

        // Instead of sending a JSON with the profile picture path, send the image file directly
        return res.status(200).json({ message: "successful profile pic fetch", profilePicURL: result });
    } catch (error) {
        console.error('Failed to fetch profile pic:', error);
        res.status(500).json({ error: `Internal Server Error: failed to fetch profile pic ${error}` });
    }
});


// used for changing the user's username, password, or email 
profile.put('/modifyProfile', async (req, res) => {
    try {
        const { username, newUsername, newEmail, newPassword } = req.body;
        let new_salted_password;

        if (!username) {
            return res.status(403).json({ error: 'bro did not provide the username of the user to be updated' });
        } 

        // Verify the user's original username for security reasons
        if (!req.session || req.session.username !== username) {
            return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.'} );
        }

        // check to see that any updates were provided
        if (!newUsername && !newEmail && !newPassword) {
            return res.status(400).json({ error: 'No updates provided'} );
        }

        if (newUsername) {
            if (!authUtils.isOK(newUsername)) {
                return res.status(403).json({error: 'your new username is potentially an SQL injection attack.'})
            }
            // check that the new username is valid
            if (!checkUsernameValid(newUsername)) {
                return res.status(409).json({ error: 'Username or email already exists' });
            }
        }

        if (newEmail) {
            if (!authUtils.isOK(newEmail)) {
                return res.status(403).json({error: 'your new email is potentially an SQL injection attack.'})
            }
        }

        if (newPassword) {
            if (!authUtils.isOK(newPassword)) {
                return res.status(403).json({error: 'your new password is potentially an SQL injection attack.'})
            }

            // salt the password
            new_salted_password = await new Promise((resolve, reject) => {
                authUtils.encryptPassword(newPassword, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
        }

        const result = await modifyUser(username, newUsername, newEmail, new_salted_password);
        req.session.username = newUsername || username; // Update session if username was changed

        return res.status(200).json({ message: 'Profile updated successfully', result: result });
    } catch (error) {
        console.error('Failed to update user profile:', error);
        res.status(500).json({ error: `Internal Server ${error}` });
    }
});

// allows user to add OR remove a specified hashtag (through use of req.query, i.e. '.../updateHashtags?operation=<insert 1 or 0 here>)
// 1 = adding, 0 = removing
profile.put('/modifyHashtags', async (req, res) => {

    try {
        const { username, operation, targetHashtag } = req.body;

        if (!authUtils.isOK(username) || !authUtils.isOK(operation) || !authUtils.isOK(targetHashtag)) {
            return res.status(403).json({error: 'You forgot an input OR: one or more of your inputs is potentially an SQL injection attack.'})
        }

        // Verify the user's original username for security reasons
        if (!req.session || req.session.username !== username) {
            return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
        }

        const result = await modifyUserHashtag(username, targetHashtag, operation);
        return res.status(200).json({ message: `Hashtags for ${username} changed successfully`, result: result });
    } catch (error) {
        console.error('Failed to update user hashtags:', error);
        res.status(500).json({ error: `Internal Server ${error}` });
    }
});

profile.get('/fetchSimilarActors', async (req, res) => {
    try {
        const username = req.body.username;

        // Verify the user's original username for security reasons
        if (!req.session || req.session.username !== username) {
            return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
        }

        if (!authUtils.isOK(username)) {
            return res.status(403).json({error: 'One or more of your inputs is potentially an SQL injection attack.'})
        }
        
        const result = await getSimilarActors(username);
        return res.status(200).json({ message: `Top 5 similar actors for ${username} have been calculated.`, result: result});   
    } catch (error) {
        console.error('Failed fetch similar actors:', error);
        res.status(500).json({ error: `Internal Server ${error}` });
    }
});

profile.put('/modifyLinkedActor', async (req, res) => {
    try {
        const { username, newActorNConst } = req.body;

        // Verify the user's original username for security reasons
        if (!req.session || req.session.username !== username) {
            return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
        }

        if (!authUtils.isOK(username) || !authUtils.isOK(newActorNConst)) {
            return res.status(403).json({error: 'You forgot an input OR: one or more of your inputs is potentially an SQL injection attack.'})
        }

        const result = await modifyLinkedActor(username, newActorNConst);
        
        return res.status(200).json({ message: `Linked actor for ${username} has been changed to ${newActorNConst}.`, result: result});   
    } catch (error) {
        console.error('Failed to modify linked actor:', error);
        res.status(500).json({ error: `Internal Server ${error}` });
    }
});

profile.put('/modifyProfilePic', upload.single('file'), async (req, res) => {
    try {
        const profilePic = req.file;
        const username = req.session.username; // NOT SECURE, FIX LATER

        // Verify the user's original username for security reasons
        if (!req.session || req.session.username !== username) {
            return res.status(401).json({ error: 'Unauthorized request: this user is not authenticated or does not have permission to modify this profile.' });
        }

        if (!profilePic) {
            return res.status(400).json({error: 'No image provided'});
        }

        if (!authUtils.isOK(username)) {
            return res.status(403).json({error: 'One or more of your inputs is potentially an SQL injection attack.'})
        }
        
        const result = await modifyProfilePic(username, profilePic);

        return res.status(200).json({ message: `Profile pic successfully modified: ${result.modify}` });   
    } catch (error) {
        console.error('Failed to modify user profile pic', error);
        res.status(500).json({ error: `Internal Server ${error}` });
    }
});

export default profile;
