const { requestLogger } = require('../logs');

const requestLoggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent') || 'Unknown',
    };

    if (res.statusCode >= 500) {
      requestLogger.error('API Request Failed', logData);
    } else if (res.statusCode >= 400) {
      requestLogger.warn('API Request Warning', logData);
    } else {
      requestLogger.info('API Request Success', logData);
    }
  });

  next();
};

module.exports = requestLoggerMiddleware;
