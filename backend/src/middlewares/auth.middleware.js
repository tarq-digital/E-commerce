const { verifyAccessToken } = require('../utils/jwt');
const ApiError = require('../utils/api-error');
const httpStatus = require('../constants/http-status');
const messages = require('../constants/messages');
const catchAsync = require('../utils/catch-async');

const requireAuth = catchAsync(async (req, res, next) => {
  // Try to get token from HttpOnly cookie first, then fallback to Authorization header
  let token = req.cookies?.access_token;
  
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, messages.ERROR_UNAUTHORIZED, 'UNAUTHORIZED_ACCESS');
  }

  try {
    const decoded = verifyAccessToken(token);
    // Attach user payload to request object
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, messages.ERROR_INVALID_TOKEN, 'INVALID_TOKEN');
  }
});

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(httpStatus.FORBIDDEN, messages.ERROR_FORBIDDEN, 'FORBIDDEN_ACCESS');
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
