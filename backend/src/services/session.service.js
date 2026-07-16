const SessionRepository = require("../database/repositories/session.repository");
const jwtConfig = require("../config/jwt");
const { generateOpaqueRefreshToken, hashToken } = require("../utils/jwt");
const { parseMaxAge } = require("../utils/cookie"); // We need the parser to calculate expires_at

class SessionService {
  async createSessionAndRefreshToken(userId, req) {
    const deviceId = req.headers["x-device-id"] || "Unknown Device";
    const userAgent = req.get("user-agent") || "Unknown";
    const ipAddress = req.ip;

    const expiresInMs = parseMaxAge(jwtConfig.refreshExpiresIn);
    const expiresAt = new Date(Date.now() + expiresInMs)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const sessionId = await SessionRepository.createSession({
      user_id: userId,
      device_id: deviceId,
      user_agent: userAgent,
      ip_address: ipAddress,
      expires_at: expiresAt,
    });

    const plainRefreshToken = generateOpaqueRefreshToken();
    const tokenHash = hashToken(plainRefreshToken);

    await SessionRepository.saveRefreshToken(sessionId, tokenHash, expiresAt);

    return { sessionId, plainRefreshToken };
  }

  async revokeSession(sessionId) {
    await SessionRepository.revokeSession(sessionId);
  }

  async revokeAllUserSessions(userId) {
    await SessionRepository.revokeAllUserSessions(userId);
  }

  async validateAndRotateRefreshToken(plainRefreshToken, req) {
    const tokenHash = hashToken(plainRefreshToken);
    const dbToken = await SessionRepository.findRefreshToken(tokenHash);

    if (!dbToken) {
      return null;
    }

    // Token is valid. Rotate it.
    await SessionRepository.deleteRefreshToken(tokenHash);

    const activeSession = await SessionRepository.findActiveSession(
      dbToken.session_id,
    );
    if (!activeSession) {
      return null; // Session was revoked or expired
    }

    const newPlainToken = generateOpaqueRefreshToken();
    const newHash = hashToken(newPlainToken);

    const expiresInMs = parseMaxAge(jwtConfig.refreshExpiresIn);
    const newExpiresAt = new Date(Date.now() + expiresInMs)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    await SessionRepository.saveRefreshToken(
      activeSession.id,
      newHash,
      newExpiresAt,
    );

    return {
      sessionId: activeSession.id,
      userId: activeSession.user_id,
      newPlainRefreshToken: newPlainToken,
    };
  }
}

module.exports = new SessionService();
