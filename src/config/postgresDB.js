// src/config/postgresDB.js

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.PG_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

pool.on("connect", () => {
  console.log("New client connected to PostgreSQL");
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("PostgreSQL connected:", result.rows[0]);
  });
});

module.exports = pool;
