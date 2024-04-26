import db from '../../database/db_access';

const addRecommendation = async (userID, recommended) => {
    const sql = `
        INSERT INTO
            recommendations (userID, recommended)
        VALUES 
            (${userID}', '${recommended}')
    ;`;

    return await db.insert_items(sql);
}

export default addRecommendation;