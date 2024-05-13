import express from 'express';
import routes from './src/routes/router.js';
import session from 'express-session';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'nets2120_insecure', saveUninitialized: true, cookie: { httpOnly: true, domain: "http://localhost:3000" }, resave: true
}));

// routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
