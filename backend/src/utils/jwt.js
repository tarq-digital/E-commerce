const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const jwtConfig = require("../config/jwt");

/**
 * Generates an Access Token containing user details and the session ID.
 * The session_id is critical for instantaneous revocation checks.
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  });
};

/**
 * Generates an opaque, cryptographically random Refresh Token (Not a JWT)
 * This prevents the refresh token from being decoded by the client and is securely hashed in the DB.
 */
const generateOpaqueRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.accessSecret);
};

// Generates short-lived verification tokens for email/password reset
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = {
  generateAccessToken,
  generateOpaqueRefreshToken,
  hashToken,
  verifyAccessToken,
  generateVerificationToken,
};
