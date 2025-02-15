const actorsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS actors (
            primaryName VARCHAR(255),
            birthYear INT,
            deathYear INT,
            actor_nconst_short VARCHAR(10) PRIMARY KEY,
            local_actor_image VARCHAR(255)
        );
    `;
  
    return db.create_tables(query);
};
  
export default actorsCreateTable;
