const codesCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS codes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
  
    return db.create_tables(query);
};
  
export default codesCreateTable;
