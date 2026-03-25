// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log(`PostgreSQL connected to: ${process.env.DB_NAME}`)) // ← add DB name to confirm
  .catch(err => console.error('DB connection error:', err.message));

module.exports = pool;