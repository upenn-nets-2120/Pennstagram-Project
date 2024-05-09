const postsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS posts (
            postID INT AUTO_INCREMENT PRIMARY KEY,
            userID VARCHAR(10),
            image BLOB,
            caption TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            hashtag VARCHAR(255),
            timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            postVisibility ENUM('followers', 'everyone', 'private'),
            post_json JSON
        );
    `;
  
    return db.create_tables(query);
};
  
export default postsCreateTable;
