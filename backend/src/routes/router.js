import express from 'express';
import postsRoutes from './posts-routes/index.js';
import friendRoutes from './friend-routes/index.js';
import registrationRoutes from './registration-routes/index.js';
import notificationRoutes from './notification-routes/index.js';
import chatRoutes from './chat-routes/index.js';
import loginRoutes from './login-routes/index.js';
////import profileRoutes from './profile-routes/index.js';
import searchRoutes from './search-routes/index.js';

const routes = express.Router();

routes.use('/posts', postsRoutes);
routes.use('/friends', friendRoutes);
//routes.use('/profile', profileRoutes);
routes.use('/search', searchRoutes);
routes.use('/registration', registrationRoutes);
routes.use('/notification', notificationRoutes);
routes.use('/chat', chatRoutes);
routes.use('/login', loginRoutes);

export default routes;
// src/routes/routes gather all the routes & imports individual route files and aggregates them into a single router using express.Router()
// we export this route to be used in the main index.ts file