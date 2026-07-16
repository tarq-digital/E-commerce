const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');
const { logger } = require('../logs');

const pool = mysql.createPool(dbConfig);

// Health check and initialization
pool.getConnection()
  .then((connection) => {
    logger.info('✅ Database connection established successfully.');
    connection.release();
  })
  .catch((err) => {
    logger.error('❌ Failed to connect to database:', err);
    process.exit(1);
  });

module.exports = pool;
