import db from '../../rds-setup/db_access.js';

const modifyLinkedActor = async (username, newActorNConst) => {
    const updateQuery = `UPDATE users SET linked_actor_nconst = '${newActorNConst}' WHERE username = '${username}';`;
    const updateResults = await db.send_sql(updateQuery);

    return updateResults;
};

export default modifyLinkedActor;