const users2chatsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS users2chats (
            userID INT,
            chatID INT,
            isAdmin BOOLEAN,
            PRIMARY KEY (userID, chatID),
            FOREIGN KEY (userID) REFERENCES users(userID),
            FOREIGN KEY (chatID) REFERENCES chats(chatID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default users2chatsCreateTable;
