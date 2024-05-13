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
import {uploadImageToS3} from '../../s3-setup/uploadImageToS3.js';    
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const register = express.Router();

register.post('/', async (req, res) => {
    const { username, password, email, affiliation, birthday, hashtags, userVisibility } = req.body;

    if (!username || !password || !email || !affiliation || !birthday) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!authUtils.isOK(username) || !authUtils.isOK(password)) {
        return res.status(403).json({error: 'You forgot an input OR one or more of your inputs is potentially an SQL injection attack.'})
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
    let userId;
    try {
        const newUser = await addUser(username, encryptedPassword, email, affiliation, birthday, userVisibility);
        userId = newUser.insertId;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error adding user to database' });
    }
    console.log('Account created');

    if (!authUtils.isOK(username)) {
        return res.status(403).json({error: 'You forgot an input OR one or more of your inputs is potentially an SQL injection attack.'})
    }

    if (!hashtags || hashtags.length === 0) {
        return res.status(400).json({ error: 'At least one hashtag must be selected' });
    }

    console.log("ID: ", userId);
    try {
        await addUserHashtags(userId, hashtags);
    } catch (error) {
        return res.status(500).json({ error: 'Error adding hashtags' });
    }

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

register.post('/uploadImage', upload.single('file'), async (req, res) => {
    // Verify the user's original username for security reasons
    // const username = req.body.username;
    const image = req.file;
    console.log("file:", req.file);

    if (!image) {
        return res.status(400).json({error: 'No image provided'});
    }

    try {
        const url = await uploadImageToS3(image);
        res.status(200).json({imageUrl: url});
    } catch (err) {
        res.status(500).json({error: 'Error uploading image', details: err.message});
    }
});

export default register;

