import express from 'express';
import postsRoutes from './posts.js';
import friendRoutes from './friend-routes/index.js';

// import notifications from './notifications.js';

const routes = express.Router();

routes.use('/posts', postsRoutes);
routes.use('/friends', friendRoutes);

export default routes;
// src/routes/routes gather all the routes & imports individual route files and aggregates them into a single router using express.Router()
// we export this route to be used in the main index.ts file