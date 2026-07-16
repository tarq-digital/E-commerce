const { sendSuccess } = require('../../utils/response');
const { setAuthCookies, clearAuthCookies } = require('../../utils/cookie');
const httpStatus = require('../../constants/http-status');
const messages = require('../../constants/messages');
const catchAsync = require('../../utils/catch-async');
const jwtConfig = require('../../config/jwt');
const ApiError = require('../../utils/api-error');

const AuthService = require('../../services/auth.service');
const PasswordService = require('../../services/password.service');
const SessionService = require('../../services/session.service');

const register = catchAsync(async (req, res) => {
  const user = await AuthService.register(req.body, req);
  sendSuccess(res, httpStatus.CREATED, messages.CREATED, { user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, plainRefreshToken } = await AuthService.login(email, password, req);

  setAuthCookies(res, accessToken, plainRefreshToken, jwtConfig.accessExpiresIn, jwtConfig.refreshExpiresIn);

  sendSuccess(res, httpStatus.OK, 'Login successful', { user, accessToken });
});

const logout = catchAsync(async (req, res) => {
  if (req.user && req.user.sessionId) {
    await SessionService.revokeSession(req.user.sessionId);
  }
  clearAuthCookies(res);
  sendSuccess(res, httpStatus.OK, 'Logged out successfully');
});

const refreshToken = catchAsync(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refresh_token;

  if (!incomingRefreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token missing', 'TOKEN_MISSING');
  }

  const result = await SessionService.validateAndRotateRefreshToken(incomingRefreshToken, req);
  
  if (!result) {
    clearAuthCookies(res);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired refresh token', 'INVALID_TOKEN');
  }

  const { sessionId, userId, newPlainRefreshToken } = result;

  // We need the role ID to mint the new access token. We can get it directly or via repo.
  const UserRepository = require('../../database/repositories/user.repository');
  const user = await UserRepository.findById(userId);

  const { generateAccessToken } = require('../../utils/jwt');
  const newAccessToken = generateAccessToken({
    id: user.id,
    role_id: user.role_id,
    sessionId
  });

  setAuthCookies(res, newAccessToken, newPlainRefreshToken, jwtConfig.accessExpiresIn, jwtConfig.refreshExpiresIn);

  sendSuccess(res, httpStatus.OK, 'Token refreshed successfully', { accessToken: newAccessToken });
});

const getProfile = catchAsync(async (req, res) => {
  const UserRepository = require('../../database/repositories/user.repository');
  const user = await UserRepository.findById(req.user.id);
  delete user.password_hash;
  sendSuccess(res, httpStatus.OK, 'Profile retrieved', { user });
});

const updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await AuthService.updateProfile(req.user.id, req.body, req);
  sendSuccess(res, httpStatus.OK, messages.UPDATED, { user: updatedUser });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token is required');
  }
  await AuthService.verifyEmail(token);
  sendSuccess(res, httpStatus.OK, 'Email verified successfully');
});

const forgotPassword = catchAsync(async (req, res) => {
  await PasswordService.forgotPassword(req.body.email, req);
  sendSuccess(res, httpStatus.OK, 'If the email is registered, a password reset link has been sent.');
});

const resetPassword = catchAsync(async (req, res) => {
  await PasswordService.resetPassword(req.body.token, req.body.password, req);
  sendSuccess(res, httpStatus.OK, 'Password has been reset successfully.');
});

const changePassword = catchAsync(async (req, res) => {
  await PasswordService.changePassword(req.user.id, req.body.old_password, req.body.new_password, req);
  // Log them out of the current device as well
  clearAuthCookies(res);
  sendSuccess(res, httpStatus.OK, 'Password changed successfully. Please log in again.');
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
