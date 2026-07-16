const uploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageFormats: ['image/jpeg', 'image/png', 'image/webp'],
  cloudinaryFolder: 'weebster_assets',
};

module.exports = uploadConfig;
