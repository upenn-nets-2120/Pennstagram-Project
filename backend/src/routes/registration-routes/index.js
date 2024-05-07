import express from 'express';
import {
    getUser,
    addUser,
    updateProfilePhoto,
    addUserHashtags,
    getTopHashtags,
} from '../../db/index.js'

const app = express.Router();


app.post('/signup', async (req, res) => {
    const { username, password, email, affiliation, birthday } = req.body;

    if (!username || !password || !email || !affiliation || !birthday) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const userExists = await getUser(username, email);
        if (userExists.length > 0) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Database error' });
    }

    try {
        await addUser({ username, password, email, affiliation, birthday });
    } catch (error) {
        return res.status(500).json({ error: 'Error adding user to database' });
    }

    return res.status(201).json({ message: 'Account created successfully' });
});

app.post('/upload-profile-photo', async (req, res) => {
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

app.post('/select-hashtags', async (req, res) => {
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


