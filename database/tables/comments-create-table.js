const commentsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS comments (
            commentID INT AUTO_INCREMENT PRIMARY KEY,
            postID INT,
            userID INT,
            parentCommentID INT,
            content VARCHAR(255),
            timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (postID) REFERENCES posts(postID),
            FOREIGN KEY (userID) REFERENCES users(userID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default commentsCreateTable;
