const users2actorsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS users2actors (
            userID INT,
            actor_nconst_short VARCHAR(10),
            PRIMARY KEY (userID, actor_nconst_short),
            FOREIGN KEY (userID) REFERENCES users(userID),
            FOREIGN KEY (actor_nconst_short) REFERENCES actors(actor_nconst_short)
        );
    `;
  
    return db.create_tables(query);
};
  
export default users2actorsCreateTable;
