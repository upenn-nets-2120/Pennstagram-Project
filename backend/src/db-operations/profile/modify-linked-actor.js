import db from '../../db-setup/db_access.js';

const modifyLinkedActor = async (username, newActorNConst) => {
    const updateQuery = 'UPDATE users SET linked_actor_nconst = ? WHERE username = ?';
    const updateResults = await db.query(updateQuery, [newActorNConst, username]);

    return updateResults;
};

export default modifyLinkedActor;