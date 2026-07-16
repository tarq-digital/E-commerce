const pool = require('../connection');

class PermissionRepository {
  async findByRoleId(roleId) {
    const [rows] = await pool.query(
      `SELECT p.name FROM permissions p 
       JOIN role_permissions rp ON p.id = rp.permission_id 
       WHERE rp.role_id = ?`,
      [roleId]
    );
    return rows.map(r => r.name);
  }
}

module.exports = new PermissionRepository();
