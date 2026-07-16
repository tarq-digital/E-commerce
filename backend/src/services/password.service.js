const UserRepository = require("../database/repositories/user.repository");
const AuditRepository = require("../database/repositories/audit.repository");
const SessionService = require("./session.service");
const EmailService = require("./email.service");
const { generateVerificationToken, hashToken } = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/crypto");
const ApiError = require("../utils/api-error");
const httpStatus = require("../constants/http-status");

class PasswordService {
  async forgotPassword(email, req) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Return success anyway to prevent email enumeration attacks
      return;
    }

    const plainToken = generateVerificationToken();
    const tokenHash = hashToken(plainToken);

    // Expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    await AuditRepository.saveVerificationToken(
      user.id,
      tokenHash,
      "PASSWORD_RESET",
      expiresAt,
    );

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password?token=${plainToken}`;

    // Fire and forget
    EmailService.sendPasswordReset(user, resetUrl).catch(console.error);
    AuditRepository.logAction(user.id, "PASSWORD_RESET_REQUESTED", {}, req.ip);
  }

  async resetPassword(plainToken, newPassword, req) {
    const tokenHash = hashToken(plainToken);
    const dbToken = await AuditRepository.findVerificationToken(
      tokenHash,
      "PASSWORD_RESET",
    );

    if (!dbToken) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid or expired reset token.",
        "INVALID_TOKEN",
      );
    }

    const user = await UserRepository.findById(dbToken.user_id);
    const passwordHash = await hashPassword(newPassword);

    await UserRepository.updatePassword(user.id, passwordHash);
    await AuditRepository.markTokenUsed(dbToken.id);

    // Invalidate all active sessions for security
    await SessionService.revokeAllUserSessions(user.id);

    AuditRepository.logAction(user.id, "PASSWORD_RESET_COMPLETED", {}, req.ip);
    EmailService.sendPasswordChangedAlert(user).catch(console.error);
  }

  async changePassword(userId, oldPassword, newPassword, req) {
    const user = await UserRepository.findById(userId);
    const isMatch = await comparePassword(oldPassword, user.password_hash);

    if (!isMatch) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Incorrect old password",
        "INCORRECT_PASSWORD",
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await UserRepository.updatePassword(userId, passwordHash);

    // Invalidate all active sessions across devices
    await SessionService.revokeAllUserSessions(userId);

    AuditRepository.logAction(userId, "PASSWORD_CHANGED", {}, req.ip);
    EmailService.sendPasswordChangedAlert(user).catch(console.error);
  }
}

module.exports = new PasswordService();
