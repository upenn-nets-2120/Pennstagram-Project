import db from '../../db-setup/db_access.js';

const addCode = async (code) => {
    const sql = `INSERT INTO codes (code) VALUES (${code});`;
 
     return await db.insert_items(sql);
 }

 export default addCode;