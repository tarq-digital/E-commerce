const pool = require('../../../database/connection');

class CheckoutRepository {
  async createSession(data) {
    const query = `
      INSERT INTO checkout_sessions (
        id, cart_id, user_id, guest_token, 
        currency, subtotal, tax_total, shipping_total, discount_total, grand_total,
        status, client_ip, user_agent, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))
    `;
    const params = [
      data.id, data.cart_id, data.user_id, data.guest_token,
      data.currency || 'INR', data.subtotal, data.tax_total, 
      data.shipping_total, data.discount_total, data.grand_total,
      data.status || 'INITIATED', data.client_ip, data.user_agent
    ];
    await pool.query(query, params);
    return data.id;
  }

  async findById(sessionId, userId, guestToken) {
    let query = 'SELECT * FROM checkout_sessions WHERE id = ?';
    const params = [sessionId];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    } else if (guestToken) {
      query += ' AND guest_token = ?';
      params.push(guestToken);
    }
    
    const [rows] = await pool.query(query, params);
    return rows[0] || null;
  }

  async findActiveByCartId(cartId) {
    const [rows] = await pool.query(
      'SELECT * FROM checkout_sessions WHERE cart_id = ? AND status NOT IN ("COMPLETED", "FAILED", "ABANDONED")',
      [cartId]
    );
    return rows[0] || null;
  }

  async updateContact(sessionId, email, phone) {
    await pool.query(
      'UPDATE checkout_sessions SET contact_email = ?, contact_phone = ?, status = "CONTACT_SET", updated_at = NOW() WHERE id = ?',
      [email, phone, sessionId]
    );
  }

  async updateAddresses(sessionId, shippingJson, billingJson) {
    await pool.query(
      'UPDATE checkout_sessions SET shipping_address_json = ?, billing_address_json = ?, status = "ADDRESS_SET", updated_at = NOW() WHERE id = ?',
      [JSON.stringify(shippingJson), JSON.stringify(billingJson), sessionId]
    );
  }

  async updateShipping(sessionId, methodId, shippingTotal, grandTotal) {
    await pool.query(
      'UPDATE checkout_sessions SET shipping_method_id = ?, shipping_total = ?, grand_total = ?, status = "SHIPPING_SET", updated_at = NOW() WHERE id = ?',
      [methodId, shippingTotal, grandTotal, sessionId]
    );
  }

  async updatePaymentPending(sessionId, provider, orderId) {
    await pool.query(
      'UPDATE checkout_sessions SET payment_provider = ?, payment_order_id = ?, status = "PAYMENT_PENDING", updated_at = NOW() WHERE id = ?',
      [provider, orderId, sessionId]
    );
  }

  async updateTotals(sessionId, { subtotal, tax_total, shipping_total, discount_total, grand_total }) {
    await pool.query(
      'UPDATE checkout_sessions SET subtotal = ?, tax_total = ?, shipping_total = ?, discount_total = ?, grand_total = ?, updated_at = NOW() WHERE id = ?',
      [subtotal, tax_total, shipping_total, discount_total, grand_total, sessionId]
    );
  }
}

module.exports = new CheckoutRepository();
