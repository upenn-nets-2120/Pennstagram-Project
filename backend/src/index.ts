import express from 'express';
import routes from './routes';

const app = express();
const PORT = 3000;

app.use(express.json());

// routes
app.use('/', routes);

// Simple GET route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//index.ts sets up the Express server, imports express, configures routes, and starts the server