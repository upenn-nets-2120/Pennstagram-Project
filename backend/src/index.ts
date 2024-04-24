import express from 'express';
import session from "express-session";
import routes from './routes/routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(session({
  secret: "some secret text"
}))

// routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//index.ts sets up the Express server, imports express, configures routes, and starts the server