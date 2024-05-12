import express from 'express';
import routes from './src/routes/router.js';
import session from 'express-session';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'nets2120_insecure', saveUninitialized: true, cookie: { httpOnly: false }, resave: true
}));

// routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
