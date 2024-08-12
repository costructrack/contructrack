import { Pool } from 'pg';

// Creating a new Pool instance with database connection configurations from environment variables
const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
});

// Exporting a query function that uses the pool to execute SQL queries
export const query = (text, params) => pool.query(text, params);
