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

//  console.log("typeof pool.query =", typeof pool.query);
// console.log("typeof pool.promise =", typeof pool.promise);

// const db = pool.promise();
// module.exports = db;
// console.log("typeof test.query =", typeof test.query);


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





// const mysql = require('mysql2');

// const pool = mysql.createPool(process.env.MYSQL_URL);

// const db = pool.promise();

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


// const mysql = require('mysql2');
// require('dotenv').config();
// console.log(
//   process.env.MYSQLHOST,
//   process.env.MYSQLUSER,
//   process.env.MYSQLPASSWORD,
//   process.env.MYSQLDATABASE
// );
// const pool = mysql.createPool({
//   host: process.env.MYSQLHOST,
//   port: Number(process.env.MYSQL_PORT || 3306),
//   user: process.env.MYSQLUSER,
//   password: process.env.MYSQLPASSWORD,
//   database: process.env.MYSQLDATABASE,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// module.exports = pool.promise();



const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool.promise();