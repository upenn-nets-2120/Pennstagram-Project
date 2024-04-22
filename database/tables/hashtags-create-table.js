const hashtagsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS hashtags (
            hashtagID INT AUTO_INCREMENT PRIMARY KEY,
            phrase VARCHAR(255)
        );
    `;
  
    return db.create_tables(query);
};
  
export default hashtagsCreateTable;
