const pool = require('../connection');

class UserRepository {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }

  async create(userData) {
    const { first_name, last_name, email, password_hash, role_id } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password_hash, role_id) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, password_hash, role_id]
    );
    return this.findById(result.insertId);
  }

  async updateLoginAttempts(id, attempts, lockoutUntil = null) {
    await pool.query(
      'UPDATE users SET failed_login_attempts = ?, lockout_until = ? WHERE id = ?',
      [attempts, lockoutUntil, id]
    );
  }

  async recordSuccessfulLogin(id) {
    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, lockout_until = NULL, last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  }

  async updatePassword(id, passwordHash) {
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
  }

  async verifyEmail(id) {
    await pool.query('UPDATE users SET is_email_verified = TRUE WHERE id = ?', [id]);
  }

  async updateProfile(id, profileData) {
    const { first_name, last_name } = profileData;
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
      [first_name, last_name, id]
    );
    return this.findById(id);
  }
}

module.exports = new UserRepository();
