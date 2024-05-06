import express from 'express';
import postsRoutes from './posts.js';
import friendRoutes from './friend-routes/index.js';
import profileRoutes from './profile.js';
import searchRoutes from './search.js';

// import notifications from './notifications.js';

const routes = express.Router();

routes.use('/posts', postsRoutes);
routes.use('/friends', friendRoutes);
routes.use('/profile', profileRoutes);
routes.use('/search', searchRoutes);

export default routes;
