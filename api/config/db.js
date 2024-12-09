// const { Pool } = require('pg');
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// module.exports = pool;

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
});

pool
  .connect()
  .then(() => {
    console.log("Connected to the database");

    // Test a simple query to ensure the pool is working
    return pool.query("SELECT NOW()");
  })
  .then((res) => {
    console.log("Database test query result:", res.rows[0]);
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

module.exports = pool;
