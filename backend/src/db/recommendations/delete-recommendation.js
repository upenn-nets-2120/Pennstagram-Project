import db from '../../database/db_access';

const deleteRecommendation = async (userID, recommended) => {
    const sql = `
        DELETE FROM
            recommendations
        WHERE
            userID = '${userID}'
        AND
            recommended = '${recommended}'
    ;`;

    return await db.send_sql(sql);
}

export default deleteRecommendation;