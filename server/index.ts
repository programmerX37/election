import express from 'express';
import { Pool } from 'pg';

const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'election_db',
  password: 'your_postgres_password', // Replace with your actual password
  port: 5432,
});

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Election Backend API');
});

// Example route: Get all voters
app.get('/api/voters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM voters');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});