const cloudinary = require('cloudinary').v2;
const cloudinaryConfig = require('../config/cloudinary');

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
});

/**
 * Helper to upload a stream to Cloudinary
 * (To be used when receiving files via multer)
 */
const uploadToCloudinary = (fileBuffer, folder, filename = null) => {
  return new Promise((resolve, reject) => {
    const options = { folder };
    if (filename) options.public_id = filename;

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  uploadToCloudinary,
  cloudinary,
};
