const pool = require('../connection');

class RoleRepository {
  async findByName(name) {
    const [rows] = await pool.query('SELECT * FROM roles WHERE name = ? LIMIT 1', [name]);
    return rows[0] || null;
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM roles WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }
}

module.exports = new RoleRepository();
