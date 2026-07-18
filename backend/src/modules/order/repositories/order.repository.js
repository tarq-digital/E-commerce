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

  async findById(orderId, userId = null) {
    let query = 'SELECT * FROM orders WHERE id = ?';
    const params = [orderId];
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    const [rows] = await pool.query(query, params);
    
    if (rows.length === 0) return null;
    const order = rows[0];

    // Fetch items
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    order.items = items;
    return order;
  }

  async findAllByUserId(userId, { page = 1, limit = 10, status = null, search = null }) {
    const offset = (page - 1) * limit;
    const params = [userId];
    
    let whereClause = 'WHERE o.user_id = ?';
    
    if (status) {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND (o.id LIKE ? OR oi.product_name LIKE ? OR oi.sku LIKE ?)';
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch, likeSearch);
    }

    // Use DISTINCT since we are joining order_items which might cause duplicates
    const query = `
      SELECT DISTINCT o.id, o.status, o.grand_total, o.currency, o.created_at,
      (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count,
      (SELECT product_name FROM order_items WHERE order_id = o.id LIMIT 1) as first_item_name
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countQuery = `
      SELECT COUNT(DISTINCT o.id) as total
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
    `;

    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(query, params);
    const [countRows] = await pool.query(countQuery, params.slice(0, -2)); // Remove limit/offset

    return {
      orders: rows,
      total: countRows[0].total,
      page: Number(page),
      limit: Number(limit)
    };
  }

  async updateStatus(orderId, newStatus, connection = null) {
    const db = connection || pool;
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);
  }
}

module.exports = new OrderRepository();
