/* 
Backend routes for user story #1 for profile:

As a user, I want to be able to change my profile information (including username, email, password) 
to keep my personal details updated,without triggering a status post.
*/
import express from 'express';
import profileOperations from '../dbOperations/profileOperations.js';
import authOperations from '../dbOperations/authOperations.js';
import authUtils from '../utils/authUtils.js';

const profile = express.Router();

// used for getting profile of another user OR the current user's own profile
profile.get('/fetchProfile', async (req, res) => {
    
    try {
        // Assuming 'username' is stored in the session upon login
        const username = req.session.username;
        const { desiredUsername } = req.body;
        if (!username) {
            return res.status(401).json({ error: 'User is not authenticated' });
        }

        // CAN CHANGE LATER: if the querying user trying to fetch their OWN profile, the request will return their current hashtags
        let userProfileData;
        let userHashtagData;
        let mostPopularHashtagData;
        
        if (username === desiredUsername) {
            userProfileData = await profileOperations.getOwnUser(username);
            userHashtagData = await profileOperations.getOwnHashtags(username);
            mostPopularHashtagData = await profileOperations.getPopularHashtags();
        } else {
            userProfileData = await profileOperations.getOtherUser(username);
        }

        if (userProfileData.length === 0) {
            return res.status(404).json({ error: 'User profile data not found.' });
        }

        // if userProfileData found but no HashtagData found, return no HashtagData
        if (userHashtagData.length === 0) {
            return res.status(200).json({ userProfileData: user[0] });
        }

        // otherwise return both data
        return res.status(200).json({ userProfile: userProfileData[0], userHashtags: userHashtagData[0], mostPopularHashtags: mostPopularHashtagData[0] });
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// used for changing the user's username, password, or email 
profile.put('/updateProfile', async (req, res) => {
    try {
        const username = req.body.username;
        const newUsername = req.body.newUsername;
        const newEmail = req.body.newEmail
        const newPassword = req.body.newPassword;
        let salted_password;

        // Verify the user's original username for security reasons
        if (!req.session || req.session.username !== username) {
            return res.status(401).json({ error: 'Unauthorized request'} );
        }

        if (newPassword) { // salt the password
            salted_password = await new Promise((resolve, reject) => {
                authUtils.encryptPassword(password, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
        }

        // check to see that any updates were provided
        if (!newUsername && !newEmail && !newPassword) {
            return res.status(400).json({ error: 'No updates provided'} );
        }

        // check that the new username is valid
        if (newUsername && !authOperations.checkUsernameValid(newUsername)) {
            return res.status(400).json({ error: 'No updates provided'} );
        }

        const result = await profileOperations.modifyUser(newUsername, newEmail, salted_password);
        req.session.username = newUsername || username; // Update session if username was changed

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Failed to update user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// allows user to add OR remove a specified hashtag (through use of req.query, i.e. '.../updateHashtags?operation=<insert 1 or 2 here>)
profile.post('/updateHashtags', async (req, res) => {

    try {
        const username = req.body.username;
        const operation = req.query.operation; // 1 for add, 0 for remove
        const targetHashtag = req.body.targetHashtag; // hashtag to be added or removed

        // Verify the user's original username for security reasons
        if (!req.session || req.session.username !== username) {
            return res.status(401).json({ error: 'Unauthorized request' });
        }

        const result = await profileOperations.modifyInterestedHashtag(username, targetHashtag, operation);
        return res.status(200).json({ message: `Hashtags for ${username} changed successfully`, result: result });
    } catch (error) {
        console.error('Failed to update user hashtags:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// creates a notification entry in the notificaitons database to store a persistent notificaiton of a new chat, request, etc.
profile.post('/addNotification', async (req, res) => {
    try {
        const username = req.body.username;
        const content = req.body.content;
        const type = req.body.type;

        const result = await profileOperations.addNotification(username, content, type);
        return res.status(200).json({ message: `Hashtags for ${username} changed successfully`, result: result });
    } catch (error) {
        console.error('Failed to add notification:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

profile.get('/fetchSimilarActors', async (req, res) => {
    try {
        const username = req.body.username;
        
        const result = await profileOperations.findTopFaceMatches(username);
        return res.status(200).json({ message: `Top 5 similar actors for ${username} have been calculated.`, result: result});   
    } catch (error) {
        console.error('Failed fetch similar actors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

profile.put('/modifyLinkedActor', async (req, res) => {
    try {
        const username = req.body.username;
        const newActorNConst = req.body.newActorNConst;

        const result = await profileOperations.modifyUserLinkedActor(username, newActorNConst);
        
        return res.status(200).json({ message: `Linked actor for ${username} has been changed to ${newActorNConst}.`, result: result});   
    } catch (error) {
        console.error('Failed to modify linked actor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

profile.put('/modifyProfilePic', async (req, res) => {
    try {
        const profilePic = req.body.profilePic; // not sure if this is how you transfer files over HTTP, but assuming so
        const username = req.body.username;
        
        const modifyResult = await profileOperations.modifyProfilePic(username, profilePic);

        return res.status(200).json({ message: `Profile pic successfully modified`, result: modifyResult});   
    } catch (error) {
        console.error('Failed to modify user profile pic', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default profile;
