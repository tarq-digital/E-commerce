class VariantRepository {
  async createVariant(variantData, connection) {
    const { product_id, sku, price, barcode, weight, length, width, height } =
      variantData;
    const [result] = await connection.query(
      `INSERT INTO product_variants 
       (product_id, sku, price, barcode, weight, length, width, height) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_id, sku, price, barcode, weight, length, width, height],
    );
    return result.insertId;
  }

  // Future methods for attribute linking (e.g. Color = Red) would go here
}

module.exports = new VariantRepository();
