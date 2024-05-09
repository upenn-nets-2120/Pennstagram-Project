const usersCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            userID INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255),
            firstName VARCHAR(255),
            lastName VARCHAR(255),
            salted_password VARCHAR(255),
            emailID VARCHAR(255),
            actors VARCHAR(255),
            birthday VARCHAR(255),
            affiliation VARCHAR(255),
            inviters INT,
            userProfilePic VARCHAR(255),
            userScore INT,
            userVisibility ENUM('public', 'private'),
            sessionToken VARCHAR(255)
        );
    `;
  
    return db.create_tables(query);
};
  
export default usersCreateTable;
