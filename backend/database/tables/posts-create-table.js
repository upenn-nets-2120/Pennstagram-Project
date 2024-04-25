const postsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS posts (
            postID INT AUTO_INCREMENT PRIMARY KEY,
            userID VARCHAR(10),
            image BLOB,
            caption VARCHAR(255),
            hashtag VARCHAR(255),
            timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            postVisibility ENUM('followers', 'everyone', 'private'),
            post_json JSON
        );
    `;
  
    return db.create_tables(query);
};
  
export default postsCreateTable;
