const { sendSuccess } = require('../../../utils/response');
const httpStatus = require('../../../constants/http-status');
const catchAsync = require('../../../utils/catch-async');
const pool = require('../../../database/connection');

const ProductService = require('../../../modules/catalog/services/product.service');
const CategoryService = require('../../../modules/catalog/services/category.service');
const BrandService = require('../../../modules/catalog/services/brand.service');

// Helper to format a single image object
const formatImage = (url, publicId = null, altText = "", isPrimary = true) => {
  if (!url) return null;
  return {
    secure_url: url,
    public_id: publicId,
    alt_text: altText,
    is_primary: isPrimary
  };
};

// Helper to map a product to include the standard image DTO
const mapProduct = (p) => {
  const mapped = { ...p };
  
  // Format primary image
  if (p.primary_image_url) {
    mapped.image = formatImage(p.primary_image_url, p.primary_image_public_id, p.primary_image_alt);
  } else if (p.images && p.images.length > 0) {
    const primary = p.images.find(img => img.is_primary) || p.images[0];
    mapped.image = formatImage(primary.url, primary.cloudinary_public_id, primary.alt_text);
  } else {
    mapped.image = null;
  }
  
  // Format image gallery
  if (p.images && p.images.length > 0) {
    mapped.images = p.images.map(img => formatImage(img.url, img.cloudinary_public_id, img.alt_text, img.is_primary));
  } else {
    mapped.images = [];
  }
  
  // Clean up internal query alias fields
  delete mapped.primary_image_url;
  delete mapped.primary_image_public_id;
  delete mapped.primary_image_alt;
  
  return mapped;
};

// Helper to map a category to include the standard image DTO
const mapCategory = (c) => {
  const mapped = { ...c };
  mapped.image = formatImage(c.image_url, null, c.name);
  delete mapped.image_url;
  return mapped;
};

const getHomeData = catchAsync(async (req, res) => {
  // CMS-driven homepage aggregation
  const [categories, featuredProducts, newArrivals, [banners]] = await Promise.all([
    CategoryService.getCategories({ limit: 6, is_active: 1 }), // Featured Categories
    ProductService.getProducts({ limit: 8, status: 'PUBLISHED', sort: 'created_at DESC' }), // Featured / Trending
    ProductService.getProducts({ limit: 8, status: 'PUBLISHED', sort: 'created_at DESC' }), // New Arrivals (can be customized)
    pool.query('SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order ASC LIMIT 1')
  ]);

  const activeBanner = banners[0];

  const homeData = {
    heroBanner: activeBanner ? {
      image: formatImage(activeBanner.image_url, activeBanner.cloudinary_public_id, activeBanner.title),
      title: activeBanner.title,
      subtitle: activeBanner.subtitle,
      cta_text: activeBanner.cta_text,
      cta_link: activeBanner.cta_link
    } : null,
    featuredCategories: (categories?.data || []).map(mapCategory),
    featuredProducts: (featuredProducts?.data || []).map(mapProduct),
    newArrivals: (newArrivals?.data || []).map(mapProduct),
  };

  sendSuccess(res, httpStatus.OK, 'Home data retrieved', homeData);
});

const getProducts = catchAsync(async (req, res) => {
  // Enforce published status for public storefront
  const query = { ...req.query, status: 'PUBLISHED' };
  const products = await ProductService.getProducts(query);
  if (products.data) {
    products.data = products.data.map(mapProduct);
  }
  sendSuccess(res, httpStatus.OK, 'Products retrieved', products);
});

const getProductBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  let product = await ProductService.getProductBySlug(slug); 
  if (product) {
    product = mapProduct(product);

    // Fetch related products (from the same category)
    if (product.category && product.category.id) {
      const related = await ProductService.getProducts({ 
        category_id: product.category.id,
        status: 'PUBLISHED',
        limit: 5 // Fetch 5 just in case one is the current product
      });
      
      product.related_products = (related.data || [])
        .filter(p => p.id !== product.id)
        .slice(0, 4)
        .map(mapProduct);
    } else {
      product.related_products = [];
    }
  }
  sendSuccess(res, httpStatus.OK, 'Product retrieved', { product });
});

const getCategories = catchAsync(async (req, res) => {
  const query = { ...req.query, is_active: 1 };
  const categories = await CategoryService.getCategories(query);
  if (categories.data) {
    categories.data = categories.data.map(mapCategory);
  }
  sendSuccess(res, httpStatus.OK, 'Categories retrieved', categories);
});

module.exports = {
  getHomeData,
  getProducts,
  getProductBySlug,
  getCategories,
};
