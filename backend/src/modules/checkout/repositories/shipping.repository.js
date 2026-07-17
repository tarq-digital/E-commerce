const pool = require('../../../database/connection');

class ShippingRepository {
  async getActiveMethods() {
    const [rows] = await pool.query(
      'SELECT * FROM shipping_methods WHERE is_active = 1 ORDER BY price ASC'
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM shipping_methods WHERE id = ? AND is_active = 1',
      [id]
    );
    return rows[0] || null;
  }
}

module.exports = new ShippingRepository();
