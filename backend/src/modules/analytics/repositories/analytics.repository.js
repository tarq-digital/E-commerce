const pool = require("../../../database/connection");

class AnalyticsRepository {
  /**
   * Executive Dashboard KPIs
   * Retrieves Revenue, Orders, AOV, Customers (Active), using a date range.
   */
  async getDashboardKpis(startDate, endDate) {
    let dateFilter = "";
    let params = [];

    if (startDate && endDate) {
      dateFilter = "AND created_at BETWEEN ? AND ?";
      params = [startDate, endDate];
    }

    const [[revenueStats]] = await pool.query(`
      SELECT 
        COUNT(id) as total_orders,
        SUM(grand_total) as total_revenue,
        AVG(grand_total) as average_order_value
      FROM orders 
      WHERE status NOT IN ('CANCELLED', 'REFUNDED') ${dateFilter}
    `, params);

    const [[customerStats]] = await pool.query(`
      SELECT COUNT(id) as new_customers
      FROM users
      WHERE role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER')
      ${dateFilter}
    `, params);

    return {
      total_orders: revenueStats.total_orders || 0,
      total_revenue: revenueStats.total_revenue || 0,
      average_order_value: revenueStats.average_order_value || 0,
      new_customers: customerStats.new_customers || 0
    };
  }

  /**
   * Time-series sales data for charts
   */
  async getSalesChartData(startDate, endDate, groupBy = 'DAY') {
    // In a real robust system, groupBy could be MONTH, WEEK, DAY
    // Here we assume DAY for simplicity
    
    let dateFilter = "";
    let params = [];
    if (startDate && endDate) {
      dateFilter = "AND created_at BETWEEN ? AND ?";
      params = [startDate, endDate];
    }

    const [rows] = await pool.query(`
      SELECT 
        DATE(created_at) as label,
        SUM(grand_total) as revenue,
        COUNT(id) as orders
      FROM orders
      WHERE status NOT IN ('CANCELLED', 'REFUNDED') ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `, params);

    return rows;
  }

  /**
   * Top Products by Revenue/Quantity
   */
  async getTopProducts(startDate, endDate, limit = 5) {
    let dateFilter = "";
    let params = [];
    if (startDate && endDate) {
      dateFilter = "AND created_at BETWEEN ? AND ?";
      params = [startDate, endDate];
    }
    params.push(limit);

    const [rows] = await pool.query(`
      SELECT 
        product_name as name,
        sku,
        SUM(quantity) as units_sold,
        SUM(total) as revenue generated
      FROM order_items
      WHERE order_id IN (SELECT id FROM orders WHERE status NOT IN ('CANCELLED', 'REFUNDED') ${dateFilter})
      GROUP BY product_id, variant_id, product_name, sku
      ORDER BY revenue DESC
      LIMIT ?
    `, params);

    return rows;
  }

  /**
   * Inventory Alerts (Low stock)
   */
  async getInventoryAlerts(threshold = 10) {
    const [rows] = await pool.query(`
      SELECT 
        p.name as product_name,
        v.name as variant_name,
        v.sku,
        i.available as available_stock
      FROM inventory i
      JOIN product_variants v ON i.variant_id = v.id
      JOIN products p ON v.product_id = p.id
      WHERE i.available <= ?
      ORDER BY i.available ASC
      LIMIT 10
    `, [threshold]);
    return rows;
  }

  /**
   * Log Export Actions
   */
  async logExport(adminId, reportType, format, filters, ipAddress) {
    await pool.query(`
      INSERT INTO export_logs (admin_id, report_type, format, filters_applied, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `, [adminId, reportType, format, JSON.stringify(filters), ipAddress]);
  }
}

module.exports = new AnalyticsRepository();
