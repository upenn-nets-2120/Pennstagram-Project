import dbaccess from './db_access.js';

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
  users2postsCreateTable,
  actorsCreateTable,
  users2actorsCreateTable,
  actorsLoadTable
} from './tables/create_tables_exports.js';

dbaccess.get_db_connection();

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
    users2postsCreateTable(db),
    actorsCreateTable(db),
    users2actorsCreateTable(db),
    // actorsLoadTable(db)
  ]);
}

var result = create_tables(dbaccess).then(() => {
  console.log('Tables created');
  dbaccess.close_db();
});
