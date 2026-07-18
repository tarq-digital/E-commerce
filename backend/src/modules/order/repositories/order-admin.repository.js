const pool = require("../../../database/connection");
const QueryBuilder = require("../../../utils/query-builder");

class OrderAdminRepository {
  async findAll(queryParams) {
    const baseQuery = `
      SELECT o.id, o.user_id, o.status, o.grand_total, o.currency, o.created_at, 
             o.contact_email, o.contact_phone, o.is_on_hold, o.risk_score,
             u.first_name, u.last_name,
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    const builder = new QueryBuilder(baseQuery, queryParams);
    builder
      .filter(["o.status", "o.is_on_hold"])
      .search(["o.id", "o.contact_email", "o.contact_phone", "u.first_name", "u.last_name"])
      .sort("o.created_at DESC");

    const { page, limit } = builder.paginate();
    const countQuery = builder.buildCount();
    const dataQuery = builder.build();

    const [[countResult]] = await pool.query(countQuery.sql, countQuery.values);
    const [rows] = await pool.query(dataQuery.sql, dataQuery.values);

    return {
      data: rows,
      meta: {
        total: countResult.total,
        page,
        limit,
        total_pages: Math.ceil(countResult.total / limit),
      },
    };
  }

  async findById(id) {
    const [orders] = await pool.query(
      `SELECT o.*, u.first_name, u.last_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );

    if (!orders.length) return null;
    const order = orders[0];

    const [items] = await pool.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [id]
    );
    
    const [timeline] = await pool.query(
      "SELECT * FROM order_timeline WHERE order_id = ? ORDER BY created_at DESC",
      [id]
    );

    const [shipments] = await pool.query(
      "SELECT * FROM order_shipments WHERE order_id = ? ORDER BY created_at DESC",
      [id]
    );

    const [transactions] = await pool.query(
      "SELECT * FROM payment_transactions WHERE order_id = ? ORDER BY created_at DESC",
      [id]
    );

    order.items = items;
    order.timeline = timeline;
    order.shipments = shipments;
    order.transactions = transactions;

    return order;
  }

  async updateStatus(id, newStatus, connection) {
    const db = connection || pool;
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [newStatus, id]);
  }

  async updateHoldStatus(id, isOnHold, holdReason, connection) {
    const db = connection || pool;
    await db.query("UPDATE orders SET is_on_hold = ?, hold_reason = ? WHERE id = ?", [isOnHold, holdReason, id]);
  }

  async logAudit(orderId, action, previousState, newState, actorId, actorType, ipAddress, connection) {
    const db = connection || pool;
    await db.query(
      `INSERT INTO order_audit_logs 
       (order_id, action, previous_state, new_state, actor_id, actor_type, ip_address) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, action, previousState, newState, actorId, actorType, ipAddress]
    );
  }

  async addTimelineNote(orderId, status, notes, createdById, createdByType, connection) {
    const db = connection || pool;
    await db.query(
      `INSERT INTO order_timeline (order_id, status, notes, created_by_id, created_by_type) 
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, status, notes, createdById, createdByType]
    );
  }

  async createShipment(orderId, shipmentData, connection) {
    const db = connection || pool;
    const { provider, courier, awb, tracking_number, tracking_url } = shipmentData;
    await db.query(
      `INSERT INTO order_shipments 
       (order_id, shipment_provider, courier_name, awb_number, tracking_number, tracking_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orderId, provider, courier, awb, tracking_number, tracking_url]
    );
  }
}

module.exports = new OrderAdminRepository();
