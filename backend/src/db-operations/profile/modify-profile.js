import db from '../../db-setup/db_access.js';

const modifyUser = async (newUsername, newEmail, newPassword) => {

    let updates = [];
    let params =[];

    if (newUsername) {
        updates.push('username = ?');
        params.push(newUsername);
    }
    if (newEmail) {
        updates.push('emailID = ?');
        params.push(newEmail);
    }
    if (newPassword) { // Assuming password is already hashed (salted) before reaching here
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

export default modifyUser;