const messagesCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS messages (
            messageID INT AUTO_INCREMENT PRIMARY KEY,
            userID INT,
            groupID INT,
            timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            chatOrder INT,
            FOREIGN KEY (userID) REFERENCES users(userID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default messagesCreateTable;
