const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const appConfig = require('./config/app');
const corsConfig = require('./config/cors');
const helmetConfig = require('./config/helmet');

const { globalLimiter } = require('./middlewares/rate-limiter.middleware');
const requestLoggerMiddleware = require('./middlewares/request-logger.middleware');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/error.middleware');

const apiRoutes = require('./api/routes');

const app = express();

// 1. Security Middlewares
app.use(helmet(helmetConfig));
app.use(cors(corsConfig));
app.use(globalLimiter);

// 2. Body Parsers
app.use(express.json({ limit: '10kb' })); // Mitigate Large Payload Attacks
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 3. Logging Middleware
if (appConfig.isDevelopment) {
  app.use(morgan('dev'));
}
app.use(requestLoggerMiddleware);

// 4. API Routes (Versioning)
const basePath = `/api/${appConfig.apiVersion}`;
app.use(basePath, apiRoutes);

// 5. Unmatched Route Handler
app.use('*', notFoundHandler);

// 6. Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
