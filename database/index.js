import dbaccess, { get_db_connection } from './db_access';
import { serverPort } from '../config.json';
require('dotenv').config();

// function sendQueryOrCommand(db, query, params = []) {
//   return new Promise((resolve, reject) => {
//     db.query(query, params, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// }

import { 
  usersCreateTable,
  postsCreateTable,
  commentsCreateTable,
  likesCreateTable,
  chatsCreateTable,
  hashtagsCreateTable,
  users2hashtagsCreateTable,
  posts2hashtagsCreateTable,
  recommendationsCreateTable,
  messagesCreateTable,
  friendsCreateTable,
  notificationsCreateTable,
  requestsCreateTable,
  users2postsCreateTable
} from './tables';



const create_tables = async (db) => {
  return await Promise.all([
    usersCreateTable(db),
    postsCreateTable(db),
    commentsCreateTable(db),
    likesCreateTable(db),
    chatsCreateTable(db),
    hashtagsCreateTable(db),
    users2hashtagsCreateTable(db),
    posts2hashtagsCreateTable(db),
    recommendationsCreateTable(db),
    messagesCreateTable(db),
    friendsCreateTable(db),
    notificationsCreateTable(db),
    requestsCreateTable(db),
    users2postsCreateTable(db)
  ]);
}

const db = get_db_connection();
const result = create_tables(dbaccess);
console.log('Tables created');
//db.close_db();
// dbaccess.close_db();
