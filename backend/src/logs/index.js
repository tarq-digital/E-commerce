const winston = require('winston');
const fs = require('fs');
const loggerConfig = require('../config/logger');

// Ensure log directory exists
if (!fs.existsSync(loggerConfig.directory)) {
  fs.mkdirSync(loggerConfig.directory, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const createTransports = (filename, level = 'info') => {
  return new winston.transports.File({
    filename,
    level,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  });
};

const logger = winston.createLogger({
  level: loggerConfig.level,
  format: logFormat,
  defaultMeta: { service: 'weebster-api' },
  transports: [
    createTransports(loggerConfig.files.app),
    createTransports(loggerConfig.files.error, 'error'),
  ],
});

// Separate specific loggers for modular tracking
const requestLogger = winston.createLogger({
  format: logFormat,
  transports: [createTransports(loggerConfig.files.requests)],
});

const securityLogger = winston.createLogger({
  format: logFormat,
  transports: [createTransports(loggerConfig.files.security, 'warn')],
});

const auditLogger = winston.createLogger({
  format: logFormat,
  transports: [createTransports(loggerConfig.files.audit)],
});

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = {
  logger,
  requestLogger,
  securityLogger,
  auditLogger,
};
