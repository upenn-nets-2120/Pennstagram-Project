const chatsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS chats (
            chatID INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            description VARCHAR(255),
            profilePic BLOB,
            onlyAdmins BOOLEAN
        );
    `;
  
    return db.create_tables(query);
};
  
export default chatsCreateTable;
