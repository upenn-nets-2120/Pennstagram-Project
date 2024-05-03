 
/* 
Backend routes for user story #1 for profile:

As a user, I want to be able to change my profile information (including username, email, password) 
to keep my personal details updated,without triggering a status post.
*/
import express from 'express';
import profileOperations from '../dbOperations/profileOperations';
import e from 'express';

const profileUpdates = express.Router();

// used for getting profile of another user OR the current user's own profile
profileUpdates.get('/fetchProfile', async (req, res) => {
    
    try {
        // Assuming 'username' is stored in the session upon login
        const username = req.session.username;
        const { desiredUsername } = req.body;
        if (!username) {
            return res.status(401).json({error: 'User is not authenticated'});
        }

        let user;
        if (username === desiredUsername) {
            user = await profileOperations.getOwnUser(username);
        } else {
            user = await profileOperations.getOtherUser(username);
        }

        if (user.length === 0) {
            return res.status(404).json({error: 'User not found'});
        }

        return res.status(200).send.json({message: user[0]});
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

// used for changing the user's username, password, or email 
// check HW4 for salting/hashing functionality
// make a helper function in dbOperations that checks if an inputted username is already taken and use it here (put it in a loginOperations file?)
// make another endpoint function that allows the user to change embedding? see how this functionality should be implemen
// (CAN BE MODIFIED LATER TO INCORPORATE CHANGING ACTOR EMBE)
profileUpdates.put('/updateProfile', async (req, res) => {
    try {
        const username = req.body.username;
        const newUsername = req.body.newUsername;
        const newEmail = req.body.newEmail
        const newPassword = req.body.newPassword;

        // Verify the user's original username for security reasons
        if (!req.session || req.session.username !== username) {
            return res.status(401).send('Unauthorized request');
        }

        if (newPassword) { // Assuming password is already hashed (salted) before reaching here
            // hash password here using helper function before pushing
        }

        // check to see that any updates were provided
        if (!newUsername && !newEmail && !newPassword) {
            return res.status(400).send('No updates provided');
        }

        const result = await profileOperations.modifyUser(newUsername, newEmail, newPassword);
        req.session.username = newUsername || username; // Update session if username was changed

        return res.status(200).send.json({message: 'Profile updated successfully'});
    } catch (error) {
        console.error('Failed to update user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

