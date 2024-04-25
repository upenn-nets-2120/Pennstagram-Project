const posts2hashtagsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS posts2hashtags (
            postID INT,
            hashtagID INT,
            PRIMARY KEY (postID, hashtagID),
            FOREIGN KEY (postID) REFERENCES posts(postID),
            FOREIGN KEY (hashtagID) REFERENCES hashtags(hashtagID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default posts2hashtagsCreateTable;
