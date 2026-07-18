const pool = require("../../../database/connection");
const QueryBuilder = require("../../../utils/query-builder");

class PromotionRepository {
  
  async createPromotion(data) {
    const { name, description, type, discount_value, target_type, target_id, is_automatic, min_cart_value, start_date, end_date } = data;
    
    const [result] = await pool.query(`
      INSERT INTO promotions 
      (name, description, type, discount_value, target_type, target_id, is_automatic, min_cart_value, start_date, end_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, description, type, discount_value, target_type, target_id || null, is_automatic, min_cart_value || 0, start_date || null, end_date || null]);
    
    return result.insertId;
  }

  async createCoupon(promotionId, code, usageLimit) {
    await pool.query(`
      INSERT INTO coupons (promotion_id, code, usage_limit)
      VALUES (?, ?, ?)
    `, [promotionId, code, usageLimit || null]);
  }

  async findAll(queryParams) {
    const baseQuery = `
      SELECT p.*, c.code as coupon_code, c.usage_count, c.usage_limit
      FROM promotions p
      LEFT JOIN coupons c ON p.id = c.promotion_id
    `;
    const builder = new QueryBuilder(baseQuery, queryParams);
    builder.search(["p.name", "c.code"]).sort("p.created_at DESC");

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

  async findActiveAutoPromotions() {
    const [rows] = await pool.query(`
      SELECT * FROM promotions 
      WHERE is_automatic = TRUE 
      AND status = 'ACTIVE'
      AND (start_date IS NULL OR start_date <= NOW())
      AND (end_date IS NULL OR end_date >= NOW())
      ORDER BY priority DESC, discount_value DESC
    `);
    return rows;
  }

  async findCouponByCode(code) {
    const [rows] = await pool.query(`
      SELECT c.*, p.* 
      FROM coupons c
      JOIN promotions p ON c.promotion_id = p.id
      WHERE c.code = ? 
      AND p.status = 'ACTIVE'
      AND (p.start_date IS NULL OR p.start_date <= NOW())
      AND (p.end_date IS NULL OR p.end_date >= NOW())
    `, [code]);
    return rows.length ? rows[0] : null;
  }
}

module.exports = new PromotionRepository();
