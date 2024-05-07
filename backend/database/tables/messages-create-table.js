const messagesCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS messages (
            messageID INT AUTO_INCREMENT PRIMARY KEY,
            userID INT,
            chatID INT,
            timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            content VARCHAR(255), 
            FOREIGN KEY (userID) REFERENCES users(userID),
            FOREIGN KEY (chatID) REFERENCES chats(chatID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default messagesCreateTable;
