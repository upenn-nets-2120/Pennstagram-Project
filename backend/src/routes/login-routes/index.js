import express from 'express';
import {
    
} from '../../db/index.js'

const app = express.Router();
const bcrypt = require('bcrypt'); 


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const userQuery = `SELECT user_id, hashed_password FROM users WHERE username = '${username}'`;
        const userResult = await db.send_sql(userQuery);

        if (userResult.length === 0) {
            return res.status(401).json({error: 'Username and/or password are invalid.'});
        }
        console.log(userResult);
        const user = userResult[0];

        bcrypt.compare(password, user.hashed_password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({error: 'Error querying database'});
            }

            if (isMatch) {
                req.session.user_id = user.user_id; 
                res.status(200).json({username: username});
            } else {
                res.status(401).json({error: 'Username and/or password are invalid.'});
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({error: 'Error querying database'});
    }

});


