import express from 'express';
import { posts } from './posts';
import { notifications } from './notifications';

const routes = express.Router();

routes.use(posts, notifications);

export default routes;
// src/routes/routes gather all the routes & imports individual route files and aggregates them into a single router using express.Router()
// we export this route to be used in the main index.ts file