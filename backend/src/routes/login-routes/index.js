import express from 'express';
import db from '../../db-setup/db_access.js';
import authUtils from '../../utils/authUtils.js';
import sgMail from '@sendgrid/mail';
import config from './config.json' assert { type: "json"};
import { addCode } from '../../db-operations/index.js';


const login = express.Router();

login.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const userQuery = `SELECT userID, salted_password FROM users WHERE username = '${username}'`;
        const userResults = await db.insert_items(userQuery);

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
                return res.status(200).json(userResults);
            } else {
                return res.status(401).json({ error: 'Username and/or password are invalid.' });
            }
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({error: 'Error querying database'});
    }
});

login.post('/forgot-password', async (req, res) => {
    sgMail.setApiKey(config.sendgrid_api_key);

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const userQuery = `SELECT userID, username FROM users WHERE emailID = '${email}'`;
    // Assuming db.send_sql to execute SQL queries...
    const userResults = await db.send_sql(userQuery);

    if (userResults.length === 0) {
        return res.status(404).json({ error: 'No user found with this email' });
    }
    let randomNumber = Math.floor(Math.random() * 1000000);
    const code = randomNumber.toString().padStart(6, '0');

    try {
        await addCode(code);
    } catch (error) {
        console.log("error with code inserting", error);
    }



    const msg = {
        to: email,  // Change to your recipient
        from: 'netsprojectgo7@gmail.com',  // Change to your verified sender
        subject: 'Password Reset',
        text: `You requested a password reset. Here is your verification code: ${code}`,
        html: `<strong>You requested a password reset. Here is your verification code:</strong> <a href="${code}">${code}</a>`,
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ message: 'Password reset email sent successfully', code: code });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send password reset email' });
    }
    }),


login.put('/new-password', async (req, res) => {
    const { email, newPassword } = req.body;
    console.log("EMAIL & PASS: ", newPassword);
    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and new password are required' });
    }

    if (!authUtils.isOK(newPassword)) {
        return res.status(403).json({ error: 'Your input is potentially an SQL injection attack.' });
    }

    try {
        const userQuery = `SELECT userID FROM users WHERE emailID = '${email}'`;
        const userResults = await db.send_sql(userQuery);

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userID = userResults[0].userID;

        // SALT AND HASH THE NEW PASSWORD
        let encryptedPassword;
        try {
            encryptedPassword = await new Promise((resolve, reject) => {
                authUtils.encryptPassword(newPassword, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error with salting and hashing the password' });
        }

        // Update the user's password in the database
        const updatePasswordQuery = `UPDATE users SET salted_password = '${encryptedPassword}' WHERE userID = ${userID}`;
        await db.send_sql(updatePasswordQuery);

        return res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ error: 'Database error' });
    }
});

login.get('/verify-code/:code', async (req, res) => {
    const code = req.params.code;
    console.log("Code Backend: ", code);

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        const checkQuery = `SELECT code FROM codes WHERE code = '${code}'`;
        const codes = await db.send_sql(checkQuery, [code]);

        if (codes.length > 0) {
            const deleteQuery = `DELETE FROM codes WHERE code = '${code}'`;
            await db.send_sql(deleteQuery, [code]);
            return res.status(200).json({ message: 'Code is valid and has been removed' });
        } else {
            return res.status(404).json({ error: 'Code does not exist' });
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default login;
