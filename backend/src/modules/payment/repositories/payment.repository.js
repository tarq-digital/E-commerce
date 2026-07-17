const pool = require('../../../database/connection');

class PaymentRepository {
  async createTransaction(data) {
    const query = `
      INSERT INTO payment_transactions (
        id, order_id, gateway, razorpay_order_id, amount, currency, status, idempotency_key
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.id, data.order_id, data.gateway || 'razorpay', data.razorpay_order_id,
      data.amount, data.currency, data.status || 'INITIATED', data.idempotency_key
    ];
    await pool.query(query, params);
  }

  async findByRazorpayOrderId(razorpayOrderId) {
    const [rows] = await pool.query(
      'SELECT * FROM payment_transactions WHERE razorpay_order_id = ?',
      [razorpayOrderId]
    );
    return rows[0] || null;
  }

  async updateTransaction(id, data) {
    const query = `
      UPDATE payment_transactions SET 
        razorpay_payment_id = ?, razorpay_signature = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const params = [
      data.razorpay_payment_id, data.razorpay_signature, data.status, id
    ];
    await pool.query(query, params);
  }

  async findByIdempotencyKey(key) {
    const [rows] = await pool.query(
      'SELECT * FROM payment_transactions WHERE idempotency_key = ?',
      [key]
    );
    return rows[0] || null;
  }
}

module.exports = new PaymentRepository();
