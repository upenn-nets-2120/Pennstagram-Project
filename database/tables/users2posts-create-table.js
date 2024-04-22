const users2postsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS users2posts (
            userID INT,
            postID INT,
            weight FLOAT,
            PRIMARY KEY (userID, postID),
            FOREIGN KEY (userID) REFERENCES users(userID),
            FOREIGN KEY (postID) REFERENCES posts(postID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default users2postsCreateTable;
