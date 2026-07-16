const pool = require("../connection");

class SessionRepository {
  async createSession(sessionData) {
    const { user_id, device_id, user_agent, ip_address, expires_at } =
      sessionData;
    const [result] = await pool.query(
      `INSERT INTO sessions (user_id, device_id, user_agent, ip_address, expires_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, device_id, user_agent, ip_address, expires_at],
    );
    return result.insertId;
  }

  async findActiveSession(sessionId) {
    const [rows] = await pool.query(
      "SELECT * FROM sessions WHERE id = ? AND revoked_at IS NULL AND expires_at > CURRENT_TIMESTAMP LIMIT 1",
      [sessionId],
    );
    return rows[0] || null;
  }

  async updateLastActivity(sessionId) {
    // Only update if it's not revoked
    await pool.query(
      "UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = ? AND revoked_at IS NULL",
      [sessionId],
    );
  }

  async revokeSession(sessionId) {
    await pool.query(
      "UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE id = ?",
      [sessionId],
    );
    // Cascade delete associated refresh tokens to guarantee invalidation
    await pool.query("DELETE FROM refresh_tokens WHERE session_id = ?", [
      sessionId,
    ]);
  }

  async revokeAllUserSessions(userId) {
    await pool.query(
      "UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ?",
      [userId],
    );
    // Remove all refresh tokens for this user via subquery
    await pool.query(
      `
      DELETE FROM refresh_tokens 
      WHERE session_id IN (SELECT id FROM sessions WHERE user_id = ?)
    `,
      [userId],
    );
  }

  // --- Token Operations associated with Sessions --- //

  async saveRefreshToken(sessionId, tokenHash, expiresAt) {
    await pool.query(
      "INSERT INTO refresh_tokens (session_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [sessionId, tokenHash, expiresAt],
    );
  }

  async findRefreshToken(tokenHash) {
    const [rows] = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token_hash = ? AND expires_at > CURRENT_TIMESTAMP LIMIT 1",
      [tokenHash],
    );
    return rows[0] || null;
  }

  async deleteRefreshToken(tokenHash) {
    await pool.query("DELETE FROM refresh_tokens WHERE token_hash = ?", [
      tokenHash,
    ]);
  }
}

module.exports = new SessionRepository();
