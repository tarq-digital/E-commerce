const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const appConfig = require("./config/app");
const corsConfig = require("./config/cors");
const helmetConfig = require("./config/helmet");

const { globalLimiter } = require("./middlewares/rate-limiter.middleware");
const requestLoggerMiddleware = require("./middlewares/request-logger.middleware");
const {
  notFoundHandler,
  globalErrorHandler,
} = require("./middlewares/error.middleware");

const apiRoutes = require("./api/routes");

const app = express();

// 1. Security Middlewares
app.use(helmet(helmetConfig));
app.use(cors(corsConfig));
app.use(globalLimiter);

// 2. Body Parsers
app.use(express.json({ limit: "10kb" })); // Mitigate Large Payload Attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 3. Logging Middleware
if (appConfig.isDevelopment) {
  app.use(morgan("dev"));
}
app.use(requestLoggerMiddleware);

// 4. API Routes (Versioning)
const basePath = `/api/${appConfig.apiVersion}`;
app.use(basePath, apiRoutes);

app.get('/db-debug', async (req, res) => {
  const pool = require('./database/connection');
  try {
    const [fkInfo] = await pool.query(`
      SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'payment_transactions' 
        AND REFERENCED_TABLE_NAME IS NOT NULL;
    `);
    const [colInfo] = await pool.query(`
      SHOW COLUMNS FROM payment_transactions;
    `);
    res.json({ fkInfo, colInfo });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.get('/migrate-fix', async (req, res) => {
  const pool = require('./database/connection');
  try {
    const results = [];
    try {
      await pool.query('ALTER TABLE payment_transactions DROP FOREIGN KEY payment_transactions_ibfk_1;');
      results.push('Dropped FK');
    } catch(e) { results.push('FK Drop Failed: ' + e.message); }
    
    try {
      await pool.query('ALTER TABLE payment_transactions ADD COLUMN session_id VARCHAR(36) NULL AFTER id;');
      results.push('Added session_id');
    } catch(e) { results.push('Add session_id Failed: ' + e.message); }
    
    try {
      await pool.query('ALTER TABLE payment_transactions MODIFY order_id VARCHAR(36) NULL;');
      results.push('Modified order_id');
    } catch(e) { results.push('Modify order_id Failed: ' + e.message); }
    
    try {
      await pool.query('ALTER TABLE payment_transactions ADD CONSTRAINT fk_payment_session FOREIGN KEY (session_id) REFERENCES checkout_sessions(id) ON DELETE SET NULL;');
      results.push('Added FK session_id');
    } catch(e) { results.push('Add FK Failed: ' + e.message); }

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// 5. Unmatched Route Handler
app.use("*", notFoundHandler);

// 6. Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
