const mysql = require('mysql2/promise');

/**
 * Tests a MySQL connection using provided credentials.
 * Throws an error if connection fails.
 */
const testConnection = async ({ host, port, username, password, database }) => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user: username,
      password,
      database,
      connectTimeout: 10000,
    });
    await connection.query('SELECT 1');
    return true;
  } finally {
    if (connection) await connection.end();
  }
};

/**
 * Creates a live MySQL connection pool for query execution.
 */
const createPool = ({ host, port, username, password, database }) => {
  return mysql.createPool({
    host,
    port,
    user: username,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });
};

module.exports = { testConnection, createPool };