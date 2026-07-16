const { cloudinary } = require("../../../storage/upload");

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
}

module.exports = new MediaService();
