// database operations corresponding to profileUpdates.js backend routes
import db from '../database/db_access';

const getOwnUser = async (username) => {

    const query = `SELECT userID, username, firstName, lastName, emailID, userProfilePic, userScore, userVisibility, actors
                   FROM users 
                   WHERE username = ?`;
    const result = await db.send_sql(query, [username]);
    return result;
}

const getOtherUser = async (username) => {

    const query = `SELECT username, userProfilePic,
                   FROM users 
                   WHERE username = ?;`;
    const result = await db.send_sql(query, [username]);
    return result;
}

const modifyUser = async (newUsername, newEmail, newUsername) => {

    let updates = [];
    let params =[];

    if (newUsername) {
        updates.push('username = ?');
        params.push(newUsername);
    }
    if (newUsername) {
        updates.push('emailID = ?');
        params.push(newEmail);
    }
    if (newUsername) { // Assuming password is already hashed (salted) before reaching here
        updates.push('salted_password = ?');
        params.push(newPassword);
    }

    if (updates.length === 0) {
        return res.status(400).send('No updates provided');
    }

    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE username = ?`;
    params.push(username); // Ensure the last parameter is the username for the WHERE clause

    const result = await db.send_sql(updateQuery, params);
    return result;
}

module.exports = {
    getOwnUser,
    getOtherUser,
    modifyUser,
};