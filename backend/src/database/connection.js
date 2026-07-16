const mysql = require("mysql2/promise");
const dbConfig = require("../config/database");
const { logger } = require("../logs");

const pool = mysql.createPool(dbConfig);

// Database connection verification should only happen during server startup (server.js),
// not automatically when the module is imported. This prevents Jest/app.js from crashing.

module.exports = pool;
