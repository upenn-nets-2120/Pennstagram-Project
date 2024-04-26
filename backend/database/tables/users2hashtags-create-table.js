const users2hashtagsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS users2hashtags (
            userID INT,
            hashtagID INT,
            PRIMARY KEY (userID, hashtagID),
            FOREIGN KEY (userID) REFERENCES users(userID),
            FOREIGN KEY (hashtagID) REFERENCES hashtags(hashtagID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default users2hashtagsCreateTable;
