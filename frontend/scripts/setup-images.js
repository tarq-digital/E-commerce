const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\sumit\\.gemini\\antigravity-ide\\brain\\e13e0a59-4572-4acd-b760-9791c421b628';
const destDir = 'C:\\Users\\sumit\\Desktop\\E-commerce\\frontend\\public\\placeholders';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const images = [
  { src: 'product_1784215027408.png', dest: 'product.webp' },
  { src: 'category_1784215041473.png', dest: 'category.webp' },
  { src: 'banner_1784215054733.png', dest: 'banner.webp' },
  { src: 'brand_1784215067197.png', dest: 'brand.webp' },
  { src: 'avatar_1784215080734.png', dest: 'avatar.webp' }
];

images.forEach(img => {
  const srcPath = path.join(srcDir, img.src);
  const destPath = path.join(destDir, img.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${img.src} to ${img.dest}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});
