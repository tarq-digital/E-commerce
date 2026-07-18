const pool = require("../../../database/connection");
const QueryBuilder = require("../../../utils/query-builder");

class CustomerRepository {
  async findAll(queryParams) {
    const baseQuery = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.account_status,
        u.created_at,
        u.last_login_at,
        (SELECT COUNT(o.id) FROM orders o WHERE o.user_id = u.id) as order_count,
        (SELECT SUM(o.grand_total) FROM orders o WHERE o.user_id = u.id AND o.status IN ('DELIVERED', 'COMPLETED')) as lifetime_value,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM users u
      LEFT JOIN customer_tags ct ON u.id = ct.user_id
      LEFT JOIN tags t ON ct.tag_id = t.id
      WHERE u.role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER')
    `;

    const builder = new QueryBuilder(baseQuery, queryParams);
    
    // Add custom GROUP BY because of GROUP_CONCAT
    const countQueryRaw = builder.buildCount();
    // Re-write count query to handle GROUP BY properly
    const countQuery = {
        sql: `SELECT COUNT(DISTINCT u.id) as total FROM users u LEFT JOIN customer_tags ct ON u.id = ct.user_id LEFT JOIN tags t ON ct.tag_id = t.id WHERE u.role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER')`,
        values: []
    };
    
    // Apply search logic manually for count if search exists
    if (queryParams.search) {
        countQuery.sql += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`;
        const term = `%${queryParams.search}%`;
        countQuery.values.push(term, term, term);
    }
    
    if (queryParams.status) {
        countQuery.sql += ` AND u.account_status = ?`;
        countQuery.values.push(queryParams.status);
    }

    // Apply main query logic
    if (queryParams.search) {
        builder.where("(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)", 
          [`%${queryParams.search}%`, `%${queryParams.search}%`, `%${queryParams.search}%`]
        );
    }

    if (queryParams.status) {
        builder.where("u.account_status = ?", [queryParams.status]);
    }

    let dataQuery = builder.build();
    // Append group by to the data query before order by / limit
    dataQuery.sql = dataQuery.sql.replace(/ORDER BY/i, 'GROUP BY u.id ORDER BY');
    if (!dataQuery.sql.includes('GROUP BY u.id')) {
        // If there was no ORDER BY, add it before LIMIT
        dataQuery.sql = dataQuery.sql.replace(/LIMIT/i, 'GROUP BY u.id LIMIT');
    }
    if (!dataQuery.sql.includes('GROUP BY u.id')) {
        dataQuery.sql += ' GROUP BY u.id';
    }

    const [[countResult]] = await pool.query(countQuery.sql, countQuery.values);
    const [rows] = await pool.query(dataQuery.sql, dataQuery.values);
    const { page, limit } = builder.paginate();

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
    const [users] = await pool.query(`
      SELECT 
        u.id, u.first_name, u.last_name, u.email, u.account_status, 
        u.created_at, u.last_login_at, u.trust_score, u.risk_level,
        u.email_consent, u.sms_consent, u.marketing_consent
      FROM users u
      WHERE u.id = ? AND u.role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER')
    `, [id]);

    if (!users.length) return null;
    const user = users[0];

    // Get Tags
    const [tags] = await pool.query(`
      SELECT t.id, t.name, t.color
      FROM customer_tags ct
      JOIN tags t ON ct.tag_id = t.id
      WHERE ct.user_id = ?
    `, [id]);
    user.tags = tags;

    // Get Analytics
    const [analytics] = await pool.query(`
      SELECT 
        COUNT(id) as total_orders,
        SUM(grand_total) as lifetime_value,
        AVG(grand_total) as average_order_value,
        MAX(created_at) as last_order_date
      FROM orders
      WHERE user_id = ? AND status != 'CANCELLED'
    `, [id]);
    user.analytics = analytics[0];

    // Get Addresses
    const [addresses] = await pool.query(`
      SELECT * FROM user_addresses WHERE user_id = ?
    `, [id]);
    user.addresses = addresses;

    // Get Recent Orders
    const [recentOrders] = await pool.query(`
      SELECT id, order_number, grand_total, status, created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `, [id]);
    user.recent_orders = recentOrders;

    // Get Notes
    const [notes] = await pool.query(`
      SELECT cn.*, a.first_name as admin_first_name, a.last_name as admin_last_name
      FROM customer_notes cn
      JOIN users a ON cn.admin_id = a.id
      WHERE cn.user_id = ?
      ORDER BY cn.is_pinned DESC, cn.created_at DESC
    `, [id]);
    user.notes = notes;

    // Timeline Aggregation (Registration, Logins, Orders)
    const [timeline] = await pool.query(`
      SELECT 'REGISTRATION' as type, created_at as date, 'Customer registered' as description FROM users WHERE id = ?
      UNION ALL
      SELECT 'LOGIN' as type, created_at as date, 'Customer logged in' as description FROM audit_logs WHERE user_id = ? AND action = 'LOGIN_SUCCESS'
      UNION ALL
      SELECT 'ORDER' as type, created_at as date, CONCAT('Placed order #', order_number) as description FROM orders WHERE user_id = ?
      UNION ALL
      SELECT 'NOTE' as type, created_at as date, CONCAT('Admin Note: ', type) as description FROM customer_notes WHERE user_id = ?
      ORDER BY date DESC
      LIMIT 50
    `, [id, id, id, id]);
    user.timeline = timeline;

    return user;
  }

  async updateStatus(id, status) {
      await pool.query("UPDATE users SET account_status = ? WHERE id = ?", [status, id]);
  }

  async addNote(userId, adminId, type, content, isPinned) {
      await pool.query(
          "INSERT INTO customer_notes (user_id, admin_id, type, content, is_pinned) VALUES (?, ?, ?, ?, ?)",
          [userId, adminId, type, content, isPinned]
      );
  }

  async getDashboardStats() {
      const [[totalCustomers]] = await pool.query(`SELECT COUNT(*) as count FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER')`);
      const [[activeCustomers]] = await pool.query(`SELECT COUNT(*) as count FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER') AND account_status = 'ACTIVE'`);
      const [[blockedCustomers]] = await pool.query(`SELECT COUNT(*) as count FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER') AND account_status = 'BLOCKED'`);
      
      const [[revenueStats]] = await pool.query(`
          SELECT SUM(grand_total) as total_revenue, COUNT(DISTINCT user_id) as buyers
          FROM orders WHERE status != 'CANCELLED'
      `);
      
      const avgLtv = revenueStats.buyers > 0 ? (revenueStats.total_revenue / revenueStats.buyers) : 0;

      return {
          total: totalCustomers.count,
          active: activeCustomers.count,
          blocked: blockedCustomers.count,
          avg_ltv: avgLtv
      };
  }
}

module.exports = new CustomerRepository();
