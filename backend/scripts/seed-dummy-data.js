const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { generateSlug } = require('../src/utils/slug');

// Load centralized media config
const seedMedia = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-media.json'), 'utf8'));

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Sumit@10042006',
  database: process.env.DB_NAME || 'weebster_dev',
};

async function seedData() {
  console.log('🌱 Starting database seeding...');
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    await connection.beginTransaction();

    // 1. Clear existing data
    console.log('Clearing existing data...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE banners');
    await connection.query('TRUNCATE TABLE inventory_transactions');
    await connection.query('TRUNCATE TABLE inventory');
    await connection.query('TRUNCATE TABLE product_images');
    await connection.query('TRUNCATE TABLE product_variants');
    await connection.query('TRUNCATE TABLE products');
    await connection.query('TRUNCATE TABLE categories');
    await connection.query('TRUNCATE TABLE brands');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 2. Seed Banners
    console.log('Seeding banners...');
    for (const banner of seedMedia.banners) {
      await connection.query(
        'INSERT INTO banners (title, subtitle, cta_text, cta_link, cloudinary_public_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [banner.title, banner.subtitle, banner.cta_text, banner.cta_link, banner.public_id, banner.url]
      );
    }

    // 2. Seed Categories
    console.log('Seeding categories...');
    const categories = [
      { name: 'Action Figures', description: 'Premium articulated figures' },
      { name: 'Statues & Busts', description: 'High-quality fixed pose statues' },
      { name: 'Premium Plush', description: 'Collectible plush toys' },
      { name: 'Model Kits', description: 'Build-it-yourself mecha and characters' },
      { name: 'Apparel', description: 'Themed clothing and accessories' }
    ];

    for (const cat of categories) {
      const imageUrl = seedMedia.categories[cat.name]?.url || null;
      await connection.query(
        'INSERT INTO categories (name, slug, description, image_url, status) VALUES (?, ?, ?, ?, "PUBLISHED")',
        [cat.name, generateSlug(cat.name), cat.description, imageUrl]
      );
    }
    
    const [insertedCategories] = await connection.query('SELECT * FROM categories');

    // 3. Seed Brands
    console.log('Seeding brands...');
    const brands = [
      { name: 'Bandai Spirits', description: 'Creators of Gunpla and Tamashii Nations' },
      { name: 'Good Smile Company', description: 'Makers of Nendoroid and figma' },
      { name: 'Kotobukiya', description: 'High-detail statues and plastic models' },
      { name: 'Megahouse', description: 'Premium anime figures' }
    ];

    for (const brand of brands) {
      const logoUrl = seedMedia.brands[brand.name]?.url || null;
      await connection.query(
        'INSERT INTO brands (name, slug, description, logo_url, status) VALUES (?, ?, ?, ?, "PUBLISHED")',
        [brand.name, generateSlug(brand.name), brand.description, logoUrl]
      );
    }
    
    const [insertedBrands] = await connection.query('SELECT * FROM brands');

    // 4. Seed Products
    console.log('Seeding products...');
    const products = [
      {
        name: 'Gundam Aerial 1/144 HG',
        description: 'High Grade model kit of the Gundam Aerial from The Witch from Mercury.',
        category_id: insertedCategories.find(c => c.name === 'Model Kits').id,
        brand_id: insertedBrands.find(b => b.name === 'Bandai Spirits').id,
        base_price: 24.99,
        status: 'PUBLISHED',
        stock: 100
      },
      {
        name: 'Hatsune Miku Symphony 2020 Statue',
        description: 'Beautiful 1/8 scale figure featuring Hatsune Miku in a gorgeous symphony dress.',
        category_id: insertedCategories.find(c => c.name === 'Statues & Busts').id,
        brand_id: insertedBrands.find(b => b.name === 'Good Smile Company').id,
        base_price: 189.99,
        status: 'PUBLISHED',
        stock: 5
      },
      {
        name: 'Jujutsu Kaisen Satoru Gojo Nendoroid',
        description: 'Cute, posable Nendoroid figure of Satoru Gojo.',
        category_id: insertedCategories.find(c => c.name === 'Action Figures').id,
        brand_id: insertedBrands.find(b => b.name === 'Good Smile Company').id,
        base_price: 54.99,
        status: 'PUBLISHED',
        stock: 0
      }
    ];

    for (const prod of products) {
      const slug = generateSlug(prod.name);
      const sku = `SKU-${slug.substring(0,8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

      // Insert Product
      const [prodResult] = await connection.query(
        `INSERT INTO products 
        (name, slug, sku, description, category_id, brand_id, base_price, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [prod.name, slug, sku, prod.description, prod.category_id, prod.brand_id, prod.base_price, prod.status]
      );
      
      const productId = prodResult.insertId;

      // Insert Variant (Base Variant)
      const variantSku = `${sku}-BASE`;
      const [variantResult] = await connection.query(
        'INSERT INTO product_variants (product_id, sku, price, status) VALUES (?, ?, ?, "ACTIVE")',
        [productId, variantSku, prod.base_price]
      );
      
      const variantId = variantResult.insertId;

      // Insert Inventory
      await connection.query(
        'INSERT INTO inventory (variant_id, available_stock, reserved_stock, low_stock_threshold) VALUES (?, ?, 0, 10)',
        [variantId, prod.stock]
      );

      // Insert authentic primary image from media config
      const productMedia = seedMedia.products[prod.name];
      if (productMedia) {
        await connection.query(
          'INSERT INTO product_images (product_id, variant_id, cloudinary_public_id, url, is_primary, display_order) VALUES (?, ?, ?, ?, 1, 0)',
          [productId, variantId, productMedia.public_id, productMedia.url]
        );
      }
    }

    await connection.commit();
    console.log('✅ Seeding completed successfully!');
    
    // VERIFICATION: Check row counts
    const [[{ catCount }]] = await connection.query('SELECT COUNT(*) as catCount FROM categories');
    const [[{ brandCount }]] = await connection.query('SELECT COUNT(*) as brandCount FROM brands');
    const [[{ prodCount }]] = await connection.query('SELECT COUNT(*) as prodCount FROM products');
    
    console.log(`\n📊 Verification:`);
    console.log(`- Categories: ${catCount}`);
    console.log(`- Brands: ${brandCount}`);
    console.log(`- Products: ${prodCount}`);
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Seeding failed:', error);
  } finally {
    await connection.end();
  }
}

seedData();
