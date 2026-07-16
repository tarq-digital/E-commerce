const pool = require("../../../database/connection");
const QueryBuilder = require("../../../utils/query-builder");

class BrandRepository {
  async findAll(queryParams) {
    const builder = new QueryBuilder("SELECT * FROM brands", queryParams);

    builder
      .filter(["status"])
      .search(["name", "description"])
      .sort("created_at DESC");

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
    const [rows] = await pool.query(
      "SELECT * FROM brands WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [id],
    );
    return rows[0] || null;
  }

  async findBySlug(slug) {
    const [rows] = await pool.query(
      "SELECT * FROM brands WHERE slug = ? AND deleted_at IS NULL LIMIT 1",
      [slug],
    );
    return rows[0] || null;
  }

  async create(data) {
    const {
      name,
      slug,
      description,
      status,
      seo_title,
      seo_description,
      logo_url,
    } = data;
    const [result] = await pool.query(
      `INSERT INTO brands (name, slug, description, status, seo_title, seo_description, logo_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, status, seo_title, seo_description, logo_url],
    );
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.query(
      `UPDATE brands SET ${fields.join(", ")} WHERE id = ? AND deleted_at IS NULL`,
      values,
    );
    return this.findById(id);
  }

  async softDelete(id) {
    await pool.query(
      "UPDATE brands SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
    );
  }

  async restore(id) {
    await pool.query("UPDATE brands SET deleted_at = NULL WHERE id = ?", [id]);
    return this.findById(id);
  }
}

module.exports = new BrandRepository();
