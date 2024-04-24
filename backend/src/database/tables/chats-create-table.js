const chatsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS chats (
            chatID INT AUTO_INCREMENT PRIMARY KEY,
            chatName VARCHAR(255),
            chatDescription VARCHAR(255),
            chatProfilePic BLOB,
            onlyAdmins BOOLEAN
        );
    `;
  
    return db.create_tables(query);
};
  
export default chatsCreateTable;
