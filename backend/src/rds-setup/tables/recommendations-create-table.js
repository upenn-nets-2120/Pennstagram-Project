const recommendationsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS recommendations (
            userID INT,
            recommendedID INT,
            PRIMARY KEY (userID, recommendedID),
            FOREIGN KEY (userID) REFERENCES users(userID),
            FOREIGN KEY (recommendedID) REFERENCES users(userID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default recommendationsCreateTable;
