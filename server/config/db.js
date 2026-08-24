require('dotenv').config();
const { Pool } = require('pg');

// Temporary debug logs — remove once connection is confirmed working
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD is set:', typeof process.env.DB_PASSWORD === 'string' && process.env.DB_PASSWORD.length > 0);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Database connection error:', err.message);
  }
  console.log('✅ Connected to PostgreSQL database');
  release();
});

module.exports = pool;
