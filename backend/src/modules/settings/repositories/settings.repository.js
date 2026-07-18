const pool = require("../../../database/connection");

class SettingsRepository {
  async getAllSettings() {
    const [rows] = await pool.query(`
      SELECT setting_key, setting_value, group_name, type, is_secret, is_public, validation_rule
      FROM store_settings
    `);
    return rows;
  }

  async getSettingByKey(key) {
    const [rows] = await pool.query(`
      SELECT * FROM store_settings WHERE setting_key = ?
    `, [key]);
    return rows.length ? rows[0] : null;
  }

  async updateSetting(adminId, key, value) {
    await pool.query(`
      UPDATE store_settings
      SET setting_value = ?, updated_by = ?
      WHERE setting_key = ?
    `, [value, adminId, key]);
  }

  async createSetting(data) {
    await pool.query(`
      INSERT INTO store_settings (setting_key, setting_value, group_name, type, is_secret, is_public, validation_rule, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [data.setting_key, data.setting_value, data.group_name, data.type, data.is_secret, data.is_public, data.validation_rule, data.updated_by]);
  }

  async logAudit(adminId, ipAddress, userAgent, key, oldValue, newValue) {
    await pool.query(`
      INSERT INTO settings_audit_logs (admin_id, ip_address, user_agent, setting_key, old_value, new_value)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [adminId, ipAddress, userAgent, key, oldValue, newValue]);
  }

  /**
   * Bulk update within a transaction to maintain integrity
   */
  async bulkUpdateSettings(adminId, ipAddress, userAgent, updates) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const update of updates) {
        // Fetch old value for audit logging
        const [[oldSetting]] = await connection.query(`SELECT setting_value FROM store_settings WHERE setting_key = ? FOR UPDATE`, [update.key]);
        
        const oldValue = oldSetting ? oldSetting.setting_value : null;

        if (oldSetting) {
            await connection.query(`
              UPDATE store_settings
              SET setting_value = ?, updated_by = ?
              WHERE setting_key = ?
            `, [update.value, adminId, update.key]);
        } else {
            // Note: in a pure UI flow, they'd only update existing, but just in case
            await connection.query(`
              INSERT INTO store_settings (setting_key, setting_value, group_name, updated_by)
              VALUES (?, ?, 'GENERAL', ?)
            `, [update.key, update.value, adminId]);
        }

        await connection.query(`
            INSERT INTO settings_audit_logs (admin_id, ip_address, user_agent, setting_key, old_value, new_value)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [adminId, ipAddress, userAgent, update.key, oldValue, update.value]);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new SettingsRepository();
