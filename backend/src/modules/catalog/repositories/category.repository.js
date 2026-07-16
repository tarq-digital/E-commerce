const pool = require("../../../database/connection");
const QueryBuilder = require("../../../utils/query-builder");

class CategoryRepository {
  async findAll(queryParams) {
    const builder = new QueryBuilder("SELECT * FROM categories", queryParams);

    builder
      .filter(["status", "parent_id"])
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
      "SELECT * FROM categories WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [id],
    );
    return rows[0] || null;
  }

  async findBySlug(slug) {
    const [rows] = await pool.query(
      "SELECT * FROM categories WHERE slug = ? AND deleted_at IS NULL LIMIT 1",
      [slug],
    );
    return rows[0] || null;
  }

  async create(data) {
    const {
      name,
      slug,
      parent_id,
      description,
      status,
      seo_title,
      seo_description,
      image_url,
    } = data;
    const [result] = await pool.query(
      `INSERT INTO categories (name, slug, parent_id, description, status, seo_title, seo_description, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        parent_id,
        description,
        status,
        seo_title,
        seo_description,
        image_url,
      ],
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
      `UPDATE categories SET ${fields.join(", ")} WHERE id = ? AND deleted_at IS NULL`,
      values,
    );
    return this.findById(id);
  }

  async softDelete(id) {
    await pool.query(
      "UPDATE categories SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
    );
  }

  async restore(id) {
    await pool.query("UPDATE categories SET deleted_at = NULL WHERE id = ?", [
      id,
    ]);
    return this.findById(id);
  }
}

module.exports = new CategoryRepository();
