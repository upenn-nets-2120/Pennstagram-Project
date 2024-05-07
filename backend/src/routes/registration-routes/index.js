import express from 'express';
import {
    getUser,
    addUser,
    updateProfilePhoto,
    addUserHashtags,
    getTopHashtags,
} from '../../db/index.js'
import authUtils from '../../utils/authUtils.js';

const register = express.Router();

register.post('/signup', async (req, res) => {
    const { username, password, email, affiliation, birthday } = req.body;

    if (!username || !password || !email || !affiliation || !birthday) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!authUtils.isOK(username) || !authUtils.isOK(password)) {
        return res.status(403).json({error: 'One or more of your inputs is potentially an SQL injection attack.'})
    }

    try {
        const userExists = await getUser(username, email);
        if (userExists.length > 0) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Database error' });
    }

    // SALT AND HASH THE PASSWORD
    const encryptedPassword = await new Promise((resolve, reject) => {
        authUtils.encryptPassword(password, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });

    console.log("nonencrypted password:", password);
    console.log("encrypted password:", encryptedPassword);

    try {
        await addUser(username, encryptedPassword, email, affiliation, birthday);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error adding user to database' });
    }

    return res.status(201).json({ message: 'Account created successfully' });
});

register.post('/upload-profile-photo', async (req, res) => {
    const { username, profilePhoto } = req.body;

    if (!profilePhoto) {
        return res.status(400).json({ error: 'Profile photo is required' });
    }

    try {
        await updateProfilePhoto(username, profilePhoto);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating profile photo' });
    }

    return res.status(200).json({ message: 'Profile photo updated successfully' });
});

register.post('/select-hashtags', async (req, res) => {
    const { username, hashtags } = req.body;

    if (!hashtags || hashtags.length === 0) {
        return res.status(400).json({ error: 'At least one hashtag must be selected' });
    }

    try {
        await addUserHashtags(username, hashtags);
        const popularHashtags = await getTopHashtags(10);
        res.status(200).json({ message: 'Hashtags added successfully', popularHashtags });
    } catch (error) {
        return res.status(500).json({ error: 'Error adding hashtags' });
    }
});

export default register;

