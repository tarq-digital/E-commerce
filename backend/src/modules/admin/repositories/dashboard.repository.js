const pool = require('../../../database/connection');

class DashboardRepository {
  async getSummaryStats(dateRange) {
    // For Phase 13.1, dateRange parsing is mocked or simplified.
    // In the future, parse `dateRange` into actual SQL WHERE clauses.
    
    // Aggregated query for dashboard stats
    const query = `
      SELECT 
        (SELECT SUM(grand_total) FROM orders WHERE status NOT IN ('CANCELLED', 'REFUNDED')) as total_revenue,
        (SELECT COUNT(id) FROM orders) as total_orders,
        (SELECT COUNT(id) FROM products WHERE status = 'PUBLISHED') as active_products,
        (SELECT COUNT(id) FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER')) as total_customers
    `;
    const [rows] = await pool.query(query);
    return rows[0];
  }

  async getRecentOrders(limit = 5) {
    const query = `
      SELECT id, status, grand_total, currency, created_at,
             first_item_name as item_name, item_count
      FROM orders
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [limit]);
    return rows;
  }

  async getRecentActivities(limit = 10) {
    const query = `
      SELECT a.id, a.action, a.created_at, u.first_name, u.last_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [limit]);
    return rows;
  }
}

module.exports = new DashboardRepository();
