const UserRepository = require("../database/repositories/user.repository");
const RoleRepository = require("../database/repositories/role.repository");
const SessionService = require("./session.service");
const EmailService = require("./email/EmailService");
const AuditRepository = require("../database/repositories/audit.repository");
const { hashPassword, comparePassword } = require("../utils/crypto");
const ApiError = require("../utils/api-error");
const httpStatus = require("../constants/http-status");
const {
  generateAccessToken,
  generateVerificationToken,
  hashToken,
} = require("../utils/jwt");

class AuthService {
  async register(userData, req) {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Email already in use",
        "EMAIL_EXISTS",
      );
    }

    const customerRole = await RoleRepository.findByName("CUSTOMER");
    const password_hash = await hashPassword(userData.password);

    const newUser = await UserRepository.create({
      ...userData,
      password_hash,
      role_id: customerRole.id,
    });

    // Verification token logic
    const plainToken = generateVerificationToken();
    const tokenHash = hashToken(plainToken);

    // Expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await AuditRepository.saveVerificationToken(
      newUser.id,
      tokenHash,
      "EMAIL_VERIFICATION",
      expiresAt,
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${plainToken}`;

    // Fire and forget welcome + verification email
    EmailService.sendWelcome(newUser).catch(console.error);
    EmailService.sendVerification(newUser, verificationUrl).catch(
      console.error,
    );

    AuditRepository.logAction(
      newUser.id,
      "REGISTER",
      { email: newUser.email },
      req.ip,
    );

    // Exclude password hash from response
    delete newUser.password_hash;
    return newUser;
  }

  async login(email, password, req) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Invalid credentials",
        "INVALID_CREDENTIALS",
      );
    }

    if (user.lockout_until && new Date() < new Date(user.lockout_until)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Account is temporarily locked due to too many failed attempts.",
        "ACCOUNT_LOCKED",
      );
    }

    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      const attempts = (user.failed_login_attempts || 0) + 1;
      let lockoutUntil = null;

      if (attempts >= 5) {
        // Lock out for 15 minutes
        lockoutUntil = new Date(Date.now() + 15 * 60 * 1000)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        AuditRepository.logAction(
          user.id,
          "ACCOUNT_LOCKED",
          { reason: "Too many failed logins" },
          req.ip,
        );
      }

      await UserRepository.updateLoginAttempts(user.id, attempts, lockoutUntil);
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Invalid credentials",
        "INVALID_CREDENTIALS",
      );
    }

    if (!user.is_active) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Account is disabled",
        "ACCOUNT_DISABLED",
      );
    }

    // Reset login attempts and update last login
    await UserRepository.recordSuccessfulLogin(user.id);
    AuditRepository.logAction(user.id, "LOGIN", {}, req.ip);

    // Create session and get tokens
    const { sessionId, plainRefreshToken } =
      await SessionService.createSessionAndRefreshToken(user.id, req);

    const accessToken = generateAccessToken({
      id: user.id,
      role_id: user.role_id,
      sessionId, // Bound to session
    });

    delete user.password_hash;
    return { user, accessToken, plainRefreshToken };
  }

  async verifyEmail(plainToken) {
    const tokenHash = hashToken(plainToken);
    const dbToken = await AuditRepository.findVerificationToken(
      tokenHash,
      "EMAIL_VERIFICATION",
    );

    if (!dbToken) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid or expired verification token.",
        "INVALID_TOKEN",
      );
    }

    await UserRepository.verifyEmail(dbToken.user_id);
    await AuditRepository.markTokenUsed(dbToken.id);
    AuditRepository.logAction(dbToken.user_id, "EMAIL_VERIFIED", {});
  }

  async updateProfile(userId, profileData, req) {
    const updatedUser = await UserRepository.updateProfile(userId, profileData);
    AuditRepository.logAction(userId, "PROFILE_UPDATED", profileData, req.ip);
    delete updatedUser.password_hash;
    return updatedUser;
  }

  async getProfileById(userId) {
    const user = await UserRepository.findById(userId);
    if (user) {
      delete user.password_hash;
    }
    return user;
  }
}

module.exports = new AuthService();
