import express from 'express';
import db from '../../db-setup/db_access.js';
import authUtils from '../../utils/authUtils.js';
import nodemailer from 'nodemailer';

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
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const userQuery = `SELECT userID, username FROM users WHERE emailID = '${email}'`;
        const userResults = await db.send_sql(userQuery);

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'No user found with this email' });
        }

 
        const resetURL = `https://example.com`;

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'netsprojectgo7@gmail.com',
                pass: 'Password2120'
            }
        });

        // Email options
        const mailOptions = {
            from: 'netsprojectgo7@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `You requested a password reset. Please click the following link to reset your password: ${resetURL}`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Error sending email' });
            } else {
                console.log('Email sent:', info.response);
                return res.status(200).json({ message: 'Password reset email sent successfully' });
            }
        });

    } catch (error) {
        console.error('Error handling forgot password:', error);
        return res.status(500).json({ error: 'Error querying database' });
    }
});

login.put('/new-password', async (req, res) => {
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and new password are required' });
    }

    if (!authUtils.isOK(newPassword)) {
        return res.status(403).json({ error: 'Your input is potentially an SQL injection attack.' });
    }

    try {
        const userQuery = `SELECT userID FROM users WHERE email = '${email}'`;
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

export default login;
