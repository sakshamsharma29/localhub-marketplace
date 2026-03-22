// backend/config/db.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'localhub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();

// Test connection
db.getConnection()
  .then((conn) => {
    console.log('✅ MySQL connected successfully');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ MySQL connection error:', err.message);
    process.exit(1);
  });

module.exports = db;
