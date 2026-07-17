// Centralized Image Utility
// Ensures the frontend never constructs Cloudinary URLs directly and provides deterministic fallbacks

export const getProductImage = (imageObj) => {
  if (typeof imageObj === 'string') return imageObj || '/placeholders/product.webp';
  return imageObj?.secure_url || '/placeholders/product.webp';
};

export const getCategoryImage = (imageObj) => {
  if (typeof imageObj === 'string') return imageObj || '/placeholders/category.webp';
  return imageObj?.secure_url || '/placeholders/category.webp';
};

export const getBannerImage = (imageObj) => {
  if (typeof imageObj === 'string') return imageObj || '/placeholders/banner.webp';
  return imageObj?.secure_url || '/placeholders/banner.webp';
};

export const getBrandImage = (imageObj) => {
  if (typeof imageObj === 'string') return imageObj || '/placeholders/brand.webp';
  return imageObj?.secure_url || '/placeholders/brand.webp';
};

export const getAvatarImage = (imageObj) => {
  if (typeof imageObj === 'string') return imageObj || '/placeholders/avatar.webp';
  return imageObj?.secure_url || '/placeholders/avatar.webp';
};
