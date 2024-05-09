const requestsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS requests (
            userID INT,
            requesting INT,
            PRIMARY KEY (userID, requesting),
            FOREIGN KEY (userID) REFERENCES users(userID),
            FOREIGN KEY (requesting) REFERENCES users(userID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default requestsCreateTable;
