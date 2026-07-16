class MediaRepository {
  async addProductImages(productId, variantId, imagesData, connection) {
    if (!imagesData || imagesData.length === 0) return;

    const values = imagesData.map((img) => [
      productId,
      variantId, // can be null for generic product images
      img.cloudinary_public_id,
      img.url,
      img.alt_text || "",
      img.display_order || 0,
      img.is_primary || false,
      img.is_thumbnail || false,
    ]);

    await connection.query(
      `INSERT INTO product_images 
       (product_id, variant_id, cloudinary_public_id, url, alt_text, display_order, is_primary, is_thumbnail) 
       VALUES ?`,
      [values],
    );
  }
}

module.exports = new MediaRepository();
