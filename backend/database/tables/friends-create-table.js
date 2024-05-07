const friendsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS friends (
            follower INT,
            followed INT,
            PRIMARY KEY (follower, followed),
            FOREIGN KEY (follower) REFERENCES users(userID),
            FOREIGN KEY (followed) REFERENCES users(userID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default friendsCreateTable;
