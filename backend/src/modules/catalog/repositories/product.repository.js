const pool = require("../../../database/connection");
const QueryBuilder = require("../../../utils/query-builder");

class ProductRepository {
  async findAll(queryParams) {
    const baseQuery = `
      SELECT p.*,
        pi.cloudinary_public_id AS primary_image_public_id,
        pi.url AS primary_image_url,
        pi.alt_text AS primary_image_alt
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
    `;
    const builder = new QueryBuilder(baseQuery, queryParams);
    builder
      .filter(["status", "category_id", "brand_id", "visibility"])
      .search(["name", "sku", "description"])
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
      "SELECT * FROM products WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [id],
    );
    const product = rows[0] || null;
    if (product) {
      const [images] = await pool.query(
        "SELECT id, cloudinary_public_id, url, alt_text, display_order, is_primary, is_thumbnail FROM product_images WHERE product_id = ? ORDER BY display_order ASC",
        [id]
      );
      product.images = images;
    }
    return product;
  }

  async findBySlugOrSku(identifier) {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE (slug = ? OR sku = ?) AND deleted_at IS NULL LIMIT 1",
      [identifier, identifier],
    );
    const product = rows[0] || null;
    if (product) {
      const [images] = await pool.query(
        "SELECT id, cloudinary_public_id, url, alt_text, display_order, is_primary, is_thumbnail FROM product_images WHERE product_id = ? ORDER BY display_order ASC",
        [product.id]
      );
      product.images = images;
    }
    return product;
  }

  // --- Methods executing inside a transaction --- //
  async createProduct(data, connection) {
    const {
      name,
      slug,
      sku,
      description,
      short_description,
      category_id,
      brand_id,
      base_price,
      status,
      seo_title,
      seo_description,
    } = data;
    const [result] = await connection.query(
      `INSERT INTO products 
       (name, slug, sku, description, short_description, category_id, brand_id, base_price, status, seo_title, seo_description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        sku,
        description,
        short_description,
        category_id,
        brand_id,
        base_price,
        status,
        seo_title,
        seo_description,
      ],
    );
    return result.insertId;
  }

  async createSpecifications(productId, specs, connection) {
    if (!specs || Object.keys(specs).length === 0) return;
    const values = Object.entries(specs).map(([key, value]) => [
      productId,
      key,
      value,
    ]);
    await connection.query(
      "INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES ?",
      [values],
    );
  }

  async createTags(productId, tags, connection) {
    if (!tags || tags.length === 0) return;
    for (const tag of tags) {
      // Create tag if doesn't exist
      await connection.query("INSERT IGNORE INTO tags (name) VALUES (?)", [
        tag,
      ]);
      // Link to product
      await connection.query(
        "INSERT IGNORE INTO product_tags (product_id, tag_id) SELECT ?, id FROM tags WHERE name = ?",
        [productId, tag],
      );
    }
  }

  async softDelete(id) {
    await pool.query(
      "UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
    );
  }
}

module.exports = new ProductRepository();
