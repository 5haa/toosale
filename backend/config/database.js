const { Pool } = require('pg');
require('dotenv').config();



// Parse DATABASE_URL manually for better control
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const url = new URL(dbUrl);

// Create a connection pool
const pool = new Pool({
  user: url.username,
  password: url.password,
  host: url.hostname,
  port: parseInt(url.port),
  database: url.pathname.slice(1), // Remove leading slash
  ssl: url.hostname.includes('railway') ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test database connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1);
  }
};

// Query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executed:', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};

module.exports = {
  pool,
  query,
  connectDB
};
