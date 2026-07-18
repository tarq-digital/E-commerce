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
    builder.setSoftDeleteCol('p.deleted_at')
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
      `SELECT p.*, 
        c.name as category_name, c.slug as category_slug,
        b.name as brand_name, b.slug as brand_slug, b.logo_url as brand_logo
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE (p.slug = ? OR p.sku = ?) AND p.deleted_at IS NULL LIMIT 1`,
      [identifier, identifier],
    );
    const product = rows[0] || null;
    if (product) {
      // 1. Fetch Images
      const [images] = await pool.query(
        "SELECT id, cloudinary_public_id, url, alt_text, display_order, is_primary, is_thumbnail FROM product_images WHERE product_id = ? ORDER BY display_order ASC",
        [product.id]
      );
      product.images = images;

      // 2. Fetch Specifications
      const [specs] = await pool.query(
        "SELECT spec_key, spec_value FROM product_specifications WHERE product_id = ?",
        [product.id]
      );
      product.specifications = specs;

      // 3. Fetch Variants & Inventory
      const [variants] = await pool.query(
        `SELECT pv.*, i.available_stock, i.low_stock_threshold 
         FROM product_variants pv
         LEFT JOIN inventory i ON pv.id = i.variant_id
         WHERE pv.product_id = ? AND pv.deleted_at IS NULL`,
        [product.id]
      );
      
      // 4. Fetch Variant Attributes
      if (variants.length > 0) {
        const variantIds = variants.map(v => v.id);
        const [attributes] = await pool.query(
          `SELECT vav.variant_id, a.name as attribute_name, av.value as attribute_value
           FROM variant_attribute_values vav
           JOIN attribute_values av ON vav.attribute_value_id = av.id
           JOIN attributes a ON av.attribute_id = a.id
           WHERE vav.variant_id IN (?)`,
          [variantIds]
        );
        
        // Group attributes by variant_id
        const attributesByVariant = attributes.reduce((acc, curr) => {
          if (!acc[curr.variant_id]) acc[curr.variant_id] = {};
          acc[curr.variant_id][curr.attribute_name] = curr.attribute_value;
          return acc;
        }, {});

        variants.forEach(v => {
          v.attributes = attributesByVariant[v.id] || {};
        });
      }

      product.variants = variants;
      
      // Nest category and brand for cleaner DTO
      if (product.category_id) {
        product.category = { id: product.category_id, name: product.category_name, slug: product.category_slug };
      }
      if (product.brand_id) {
        product.brand = { id: product.brand_id, name: product.brand_name, slug: product.brand_slug, logo_url: product.brand_logo };
      }
      
      delete product.category_name;
      delete product.category_slug;
      delete product.brand_name;
      delete product.brand_slug;
      delete product.brand_logo;
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
