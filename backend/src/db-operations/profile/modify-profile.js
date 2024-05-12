import db from '../../db-setup/db_access.js';

const modifyUser = async (username, newUsername, newEmail, newPassword) => {
    // Use an array to build up the SET clause of the query
    const updates = [];

    // Check for each parameter and construct the appropriate part of the query
    if (newUsername) {
        updates.push(`username = '${newUsername}'`);
    }
    if (newEmail) {
        updates.push(`emailID = '${newEmail}'`);
    }
    if (newPassword) { // Assuming password is already hashed (salted) before reaching here
        updates.push(`salted_password = '${newPassword}'`);
    }

    // If no updates are specified, return an error message
    if (updates.length === 0) {
        return { status: 400, message: 'No updates provided' };
    }

    // Use string interpolation to construct the final query
    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE username = '${username}'`;

    const result = await db.send_sql(updateQuery);
    return result;
};

export default modifyUser;
