import db from '../../db-setup/db_access.js';

const getTopHashtags = async () => {
    const popularityQuery = `SELECT h.phrase, SUM(total.count) AS popularity
                             FROM (
                                SELECT hashtagID, COUNT(*) AS count
                                FROM posts2hashtags
                                GROUP BY hashtagID
                                UNION ALL
                                SELECT hashtagID, COUNT(*) AS count
                                FROM users2hashtags
                                GROUP BY hashtagID
                             ) AS total
                             JOIN hashtags h ON h.hashtagID = total.hashtagID
                             GROUP BY total.hashtagID
                             ORDER BY popularity DESC;`
    const results = await db.send_sql(popularityQuery);
    return results;
};

export default getTopHashtags;