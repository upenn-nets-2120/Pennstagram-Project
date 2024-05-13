import express from 'express';
import {
    getUser,
    addUser,
    updateProfilePhoto,
    addUserHashtags,
    getTopHashtagsSem,
    checkUsernameValid
} from '../../db-operations/index.js';
import authUtils from '../../utils/authUtils.js';

const register = express.Router();

register.post('/', async (req, res) => {
    const { username, password, email, affiliation, birthday, /* profilePhoto, */ hashtags, userVisibility } = req.body;

    if (!username || !password || !email || !affiliation || !birthday) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!authUtils.isOK(username) || !authUtils.isOK(password)) {
        return res.status(403).json({error: 'One or more of your inputs is potentially an SQL injection attack.'})
    }

    try {
        const usernameValid = await checkUsernameValid(username, email);
        if (!usernameValid) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Database error' });
    }

    // SALT AND HASH THE PASSWORD
    let encryptedPassword;
    try {
        encryptedPassword = await new Promise((resolve, reject) => {
            authUtils.encryptPassword(password, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'error with salting and hashing the password' });
    }

    // add the user to the database if we got here
    try {
        await addUser(username, encryptedPassword, email, affiliation, birthday, userVisibility);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error adding user to database' });
    }
    console.log('Account created');

    // if (!profilePhoto) {
    //     return res.status(400).json({ error: 'Profile photo is required' });
    // }

    // try {
    //     await updateProfilePhoto(username, profilePhoto);
    // } catch (error) {
    //     return res.status(500).json({ error: 'Error updating profile photo' });
    // }
    // console.log('Profile photo updated successfully');

    if (!authUtils.isOK(username) /* || !authUtils.isOK(hashtags) */ ) {
        return res.status(403).json({error: 'One or more of your inputs is potentially an SQL injection attack.'})
    }

    // if (!hashtags || hashtags.length === 0) {
    //     return res.status(400).json({ error: 'At least one hashtag must be selected' });
    // }

    // try {
    //     await addUserHashtags(username, hashtags);
    // } catch (error) {
    //     return res.status(500).json({ error: 'Error adding hashtags' });
    // }

    return res.status(201).json({ message: 'Account created successfully' });
});

register.get('/select-hashtags', async (req, res) => {
    let popularHashtags
    try {
        popularHashtags = await getTopHashtagsSem(10);
        res.status(200).json({ message: 'Got Top Hashtags', popularHashtags });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error getting hashtags' });
    }

    return popularHashtags;
});



export default register;

