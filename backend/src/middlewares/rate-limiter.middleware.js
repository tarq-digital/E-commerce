const rateLimit = require('express-rate-limit');
const httpStatus = require('../constants/http-status');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(httpStatus.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes.',
      error_code: 'RATE_LIMIT_EXCEEDED',
    });
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Strict limit for login/register
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(httpStatus.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Too many login attempts. Please try again later.',
      error_code: 'AUTH_RATE_LIMIT_EXCEEDED',
    });
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
};
