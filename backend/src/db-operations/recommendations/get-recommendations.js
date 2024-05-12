import db from '../../db-setup/db_access.js';

const getRecommendationsFromUser = async (userID) => {
    const sql = `
        SELECT
            *
        FROM
            recommendations
        JOIN
            users ON recommendations.userID = users.userID
        WHERE
            recommendations.recommendedID = '${userID}'
    ;`;

    return await db.send_sql(sql);
}

export default getRecommendationsFromUser;