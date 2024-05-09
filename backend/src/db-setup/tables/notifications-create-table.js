const notificationsCreateTable = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS notifications (
            notificationID INT AUTO_INCREMENT PRIMARY KEY,
            userID INT,
            type ENUM('follow request', 'like', 'comment', 'message'),
            content VARCHAR(255),
            FOREIGN KEY (userID) REFERENCES users(userID)
        );
    `;
  
    return db.create_tables(query);
};
  
export default notificationsCreateTable;
