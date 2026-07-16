const { verifyAccessToken } = require("../utils/jwt");
const ApiError = require("../utils/api-error");
const httpStatus = require("../constants/http-status");
const messages = require("../constants/messages");
const catchAsync = require("../utils/catch-async");
const SessionRepository = require("../database/repositories/session.repository");
const RoleRepository = require("../database/repositories/role.repository");
const PermissionRepository = require("../database/repositories/permission.repository");
const { logger } = require("../logs");

const requireAuth = catchAsync(async (req, res, next) => {
  let token = req.cookies?.access_token;

  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      messages.ERROR_UNAUTHORIZED,
      "UNAUTHORIZED_ACCESS",
    );
  }

  try {
    const decoded = verifyAccessToken(token);

    // Security: Check if session was revoked in the DB
    if (decoded.sessionId) {
      const activeSession = await SessionRepository.findActiveSession(
        decoded.sessionId,
      );
      if (!activeSession) {
        throw new Error("Session Revoked");
      }

      // Async update last activity (fire and forget to save latency)
      SessionRepository.updateLastActivity(decoded.sessionId).catch((err) =>
        logger.error("Failed to update session activity:", err),
      );
    }

    req.user = decoded; // { id, role_id, sessionId, ... }
    next();
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      messages.ERROR_INVALID_TOKEN,
      "INVALID_TOKEN",
    );
  }
});

const requireRole = (...roleNames) => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        messages.ERROR_UNAUTHORIZED,
        "UNAUTHORIZED_ACCESS",
      );
    }

    const userRole = await RoleRepository.findById(req.user.role_id);
    if (!userRole || !roleNames.includes(userRole.name)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        messages.ERROR_FORBIDDEN,
        "FORBIDDEN_ACCESS",
      );
    }

    next();
  });
};

const requirePermission = (permissionName) => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        messages.ERROR_UNAUTHORIZED,
        "UNAUTHORIZED_ACCESS",
      );
    }

    const permissions = await PermissionRepository.findByRoleId(
      req.user.role_id,
    );
    if (!permissions.includes(permissionName)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `Requires permission: ${permissionName}`,
        "FORBIDDEN_ACCESS",
      );
    }

    next();
  });
};

module.exports = {
  requireAuth,
  requireRole,
  requirePermission,
};
