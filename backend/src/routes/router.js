import express from 'express';
import postsRoutes from './posts.js';
import profileUpdatesRoutes from './profile.js'

// import notifications from './notifications.js';

const routes = express.Router();

routes.use('/posts', postsRoutes);
routes.use('/profile', profileUpdatesRoutes);

export default routes;
