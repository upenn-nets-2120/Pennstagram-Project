import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Simple GET route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
