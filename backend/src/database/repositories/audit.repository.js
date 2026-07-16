const pool = require("../connection");

class AuditRepository {
  async logAction(userId, action, details, ipAddress = null) {
    try {
      await pool.query(
        "INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)",
        [userId, action, JSON.stringify(details), ipAddress],
      );
    } catch (error) {
      // We don't want an audit log failure to crash the main transaction
      console.error("[AUDIT_ERROR] Failed to write audit log:", error);
    }
  }

  // --- Verification / Password Tokens --- //

  async saveVerificationToken(userId, tokenHash, type, expiresAt) {
    await pool.query(
      "INSERT INTO verification_tokens (user_id, token_hash, type, expires_at) VALUES (?, ?, ?, ?)",
      [userId, tokenHash, type, expiresAt],
    );
  }

  async findVerificationToken(tokenHash, type) {
    const [rows] = await pool.query(
      "SELECT * FROM verification_tokens WHERE token_hash = ? AND type = ? AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP LIMIT 1",
      [tokenHash, type],
    );
    return rows[0] || null;
  }

  async markTokenUsed(tokenId) {
    await pool.query(
      "UPDATE verification_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?",
      [tokenId],
    );
  }
}

module.exports = new AuditRepository();
