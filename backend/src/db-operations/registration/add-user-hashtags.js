import db from '../../db-setup/db_access.js';

const addUserHashtags = async (userID, hashtags) => {
    let cleaned;
    let data;
    for (const hashtag of hashtags) {
        cleaned = hashtag.label.replace(/^#/, '')
        try {
            // Step 1: Insert new hashtag
            data = await db.send_sql(`INSERT INTO hashtags (phrase) VALUES ('${cleaned}')`);
            // Step 2: Retrieve the last insert ID
            // const hashtagIDResult = await db.send_sql('SELECT LAST_INSERT_ID() as hashtagID');
            console.log("sdjfsdljkf:", data.insertId);
            const hashtagID = data.insertId;
            // Step 3: Insert into users2hashtags table
            await db.send_sql(`INSERT INTO users2hashtags (userID, hashtagID) VALUES (${userID}, ${hashtagID})`);
        } catch (error) {
            console.error('Failed to insert hashtag:', hashtag.label, 'Error:', error);
        }
    }
}

export default addUserHashtags;
