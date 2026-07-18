const pool = require('../../../database/connection');

class TimelineRepository {
  async addEntry(orderId, status, notes, actorType, actorId, connection = null) {
    const db = connection || pool;
    const query = `
      INSERT INTO order_timeline (order_id, status, notes, created_by_type, created_by_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [orderId, status, notes, actorType, actorId]);
  }

  async getTimelineByOrderId(orderId) {
    const query = `
      SELECT * FROM order_timeline 
      WHERE order_id = ? 
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.query(query, [orderId]);
    return rows;
  }

  async addAuditLog(orderId, action, prevState, newState, actorType, actorId, ipAddress, connection = null) {
    const db = connection || pool;
    const query = `
      INSERT INTO order_audit_logs (order_id, action, previous_state, new_state, actor_type, actor_id, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(query, [orderId, action, prevState, newState, actorType, actorId, ipAddress]);
  }
}

module.exports = new TimelineRepository();
