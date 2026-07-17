const pool = require('../../../database/connection');

class OrderRepository {
  async createOrder(data, items) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert Order
      const orderQuery = `
        INSERT INTO orders (
          id, user_id, checkout_session_id, status, currency,
          subtotal, tax_total, shipping_total, discount_total, grand_total,
          shipping_address_json, billing_address_json, contact_email, contact_phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const orderParams = [
        data.id, data.user_id, data.checkout_session_id, data.status || 'PENDING', data.currency,
        data.subtotal, data.tax_total, data.shipping_total, data.discount_total, data.grand_total,
        JSON.stringify(data.shipping_address_json), JSON.stringify(data.billing_address_json),
        data.contact_email, data.contact_phone
      ];
      await connection.query(orderQuery, orderParams);

      // Insert Order Items
      if (items && items.length > 0) {
        const itemQuery = `
          INSERT INTO order_items (
            order_id, product_id, variant_id, product_name, variant_name, 
            sku, price, quantity, total
          ) VALUES ?
        `;
        const itemValues = items.map(item => [
          data.id, item.product_id, item.variant_id, item.product_name, item.variant_name,
          item.sku, item.price, item.quantity, (item.price * item.quantity)
        ]);
        await connection.query(itemQuery, [itemValues]);
      }

      await connection.commit();
      return data.id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(orderId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    return rows[0] || null;
  }
}

module.exports = new OrderRepository();
