// // backend/config/db.js
// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.MYSQLHOST,
//   port: process.env.MYSQLPORT,
//   user: process.env.MYSQLUSER,
//   password: process.env.MYSQLPASSWORD,
//   database: process.env.MYSQLDATABASE,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// const db = pool.promise();

// // Test connection
// db.getConnection()
//   .then((conn) => {
//     console.log('✅ MySQL connected successfully');
//     conn.release();
//   })
//   .catch((err) => {
//     console.error('❌ MySQL connection error:', err.message);
//     process.exit(1);
//   });

// module.exports = db;





const mysql = require('mysql2');

const pool = mysql.createPool(process.env.MYSQL_URL);

const db = pool.promise();

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