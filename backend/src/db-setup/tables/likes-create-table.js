const likesCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS likes (
            postID INT,
            liker INT,
            PRIMARY KEY (postID, liker),
            FOREIGN KEY (postID) REFERENCES posts(postID),
            FOREIGN KEY (liker) REFERENCES users(userID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default likesCreateTable;

