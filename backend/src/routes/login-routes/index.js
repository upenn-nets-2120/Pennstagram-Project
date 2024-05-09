import express from 'express';
import db from '../../db-setup/db_access.js';
import authUtils from '../../utils/authUtils.js';

const login = express.Router();

login.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const userQuery = `SELECT userID, salted_password FROM users WHERE username = '${username}'`;
        const userResults = await db.send_sql(userQuery);

        if (userResults.length === 0) {
            return res.status(401).json({error: 'Username and/or password are invalid.'});
        }
        const user = userResults[0];
        console.log("stored password:", user.salted_password);

        // Compare the input password with the stored hashed password
        authUtils.comparePassword(password, user.salted_password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({error: 'Error during password validation'});
            }

            if (isMatch) {
                req.session.username = username;
                return res.status(200).json({ username: username });
            } else {
                return res.status(401).json({ error: 'Username and/or password are invalid.' });
            }
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({error: 'Error querying database'});
    }
});

export default login;
