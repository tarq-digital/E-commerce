const { cloudinary } = require("../../../storage/upload");
const MediaRepository = require("../repositories/media.repository");

class MediaService {
  /**
   * Uploads multiple multer file buffers to Cloudinary
   */
  async uploadImages(files, folderPath) {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: folderPath },
          (error, result) => {
            if (error) reject(error);
            else
              resolve({
                cloudinary_public_id: result.public_id,
                url: result.secure_url,
                display_order: index,
                is_primary: index === 0, // First image is primary
                is_thumbnail: index === 0,
              });
          },
        );
        uploadStream.end(file.buffer);
      });
    });

    return Promise.all(uploadPromises);
  }
  async getFolders(parentId) {
    return await MediaRepository.getFolders(parentId);
  }

  async getAssets(folderId, page, limit) {
    return await MediaRepository.getAssets(folderId, page, limit);
  }

  async deleteAsset(id) {
    const asset = await MediaRepository.getAssetById(id);
    if (!asset) throw new Error("Asset not found");

    // Check Usage Protection (Architecture Prep: we would query product_images, banners, settings here)
    // if (isUsed) throw new Error("Cannot delete asset because it is currently in use");

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(asset.public_id);

    // Delete from DB
    await MediaRepository.deleteAsset(id);
  }

  async processUpload(file, folderId, adminId) {
    if (!file) throw new Error("No file uploaded");

    // Basic MIME validation
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`Invalid file type: ${file.mimetype}`);
    }

    // Stream to Cloudinary
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'enterprise_media', resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
    });

    // Save to DB
    const assetId = await MediaRepository.createAsset({
      folder_id: folderId,
      filename: file.originalname,
      public_id: result.public_id,
      secure_url: result.secure_url,
      mime_type: file.mimetype,
      size_bytes: file.size,
      width: result.width,
      height: result.height,
      uploaded_by: adminId
    });

    return await MediaRepository.getAssetById(assetId);
  }
}

module.exports = new MediaService();
