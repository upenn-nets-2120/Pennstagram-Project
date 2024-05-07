import express from 'express';
import routes from './src/routes/router.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
