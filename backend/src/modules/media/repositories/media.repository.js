const pool = require("../../../database/connection");

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
  async getFolders(parentId = null) {
    let query = `SELECT * FROM media_folders WHERE parent_id IS NULL ORDER BY name ASC`;
    let params = [];
    if (parentId) {
      query = `SELECT * FROM media_folders WHERE parent_id = ? ORDER BY name ASC`;
      params = [parentId];
    }
    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getAssets(folderId = null, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM media_assets WHERE folder_id IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    let params = [limit, offset];
    
    if (folderId) {
      query = `SELECT * FROM media_assets WHERE folder_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [folderId, limit, offset];
    }
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  async createAsset(data) {
    const [result] = await pool.query(`
      INSERT INTO media_assets (folder_id, filename, public_id, secure_url, mime_type, size_bytes, width, height, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.folder_id || null, 
      data.filename, 
      data.public_id, 
      data.secure_url, 
      data.mime_type, 
      data.size_bytes, 
      data.width || null, 
      data.height || null, 
      data.uploaded_by || null
    ]);
    return result.insertId;
  }

  async getAssetById(id) {
    const [rows] = await pool.query(`SELECT * FROM media_assets WHERE id = ?`, [id]);
    return rows.length ? rows[0] : null;
  }

  async deleteAsset(id) {
    await pool.query(`DELETE FROM media_assets WHERE id = ?`, [id]);
  }
}

module.exports = new MediaRepository();
