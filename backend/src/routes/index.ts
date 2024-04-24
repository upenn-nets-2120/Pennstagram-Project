import express from 'express';
import { posts } from './posts';

const app = express();
const PORT = 3000;
const routes = express.Router();

routes.use(posts);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

export default routes;


//src/routes/index.ts gather all the routes & imports individual route files and aggregates them into a single router using express.Router()
//we export this route to be used in the main index.ts file