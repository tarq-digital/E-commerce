const { logger } = require('../logs');
const ApiError = require('../utils/api-error');
const appConfig = require('../config/app');
const httpStatus = require('../constants/http-status');
const messages = require('../constants/messages');

// 404 Handler
const notFoundHandler = (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, messages.ERROR_NOT_FOUND, 'ROUTE_NOT_FOUND'));
};

// Global Error Handler
const globalErrorHandler = (err, req, res, next) => {
  let { statusCode, message, errorCode } = err;

  if (!(err instanceof ApiError)) {
    statusCode = statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    message = err.message || messages.ERROR_SERVER;
    errorCode = 'INTERNAL_ERROR';
    
    // Log unexpected errors
    logger.error(`[UNHANDLED ERROR] ${err.stack}`);
  } else {
    // Log operational errors based on severity
    if (statusCode >= 500) {
      logger.error(`[API ERROR 5xx] ${err.stack}`);
    } else {
      logger.warn(`[API ERROR ${statusCode}] ${message} - ${req.originalUrl}`);
    }
  }

  res.locals.errorMessage = message;

  const response = {
    success: false,
    message,
    error_code: errorCode,
  };

  // Only include stack trace in development
  if (appConfig.isDevelopment) {
    response.stack = err.stack;
  }
  
  // Include validation details if provided by Joi middleware
  if (err.details) {
    response.details = err.details;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
