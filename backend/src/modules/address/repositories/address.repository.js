const pool = require('../../../database/connection');

class AddressRepository {
  async findByUserId(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    return rows;
  }

  async findById(id, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM user_addresses WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  }

  async create(data) {
    const query = `
      INSERT INTO user_addresses (
        user_id, first_name, last_name, phone, email, 
        address_line1, address_line2, city, state, pincode, country, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.user_id, data.first_name, data.last_name, data.phone, data.email || null,
      data.address_line1, data.address_line2 || null, data.city, data.state, data.pincode, 
      data.country || 'India', data.is_default ? 1 : 0
    ];
    
    const [result] = await pool.query(query, params);
    return result.insertId;
  }

  async update(id, userId, data) {
    const query = `
      UPDATE user_addresses SET 
        first_name = ?, last_name = ?, phone = ?, email = ?, 
        address_line1 = ?, address_line2 = ?, city = ?, state = ?, 
        pincode = ?, country = ?, is_default = ?
      WHERE id = ? AND user_id = ?
    `;
    const params = [
      data.first_name, data.last_name, data.phone, data.email || null,
      data.address_line1, data.address_line2 || null, data.city, data.state, 
      data.pincode, data.country || 'India', data.is_default ? 1 : 0,
      id, userId
    ];
    await pool.query(query, params);
  }

  async removeDefaultFlags(userId) {
    await pool.query(
      'UPDATE user_addresses SET is_default = 0 WHERE user_id = ?',
      [userId]
    );
  }

  async delete(id, userId) {
    await pool.query(
      'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  }
}

module.exports = new AddressRepository();
