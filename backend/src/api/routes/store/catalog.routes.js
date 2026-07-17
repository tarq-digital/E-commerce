const express = require('express');
const catalogController = require('../../controllers/store/catalog.controller');

const router = express.Router();

// Public storefront routes (No authentication required, highly cacheable)
router.get('/home', catalogController.getHomeData);
router.get('/products', catalogController.getProducts);
router.get('/products/:slug', catalogController.getProductBySlug);
router.get('/categories', catalogController.getCategories);

// TEMPORARY DEBUG ROUTE
const cloudinary = require('cloudinary').v2;
router.get('/debug/cloudinary', async (req, res) => {
  cloudinary.config({
    cloud_name: 'zsl36hvv',
    api_key: '886287456181663',
    api_secret: 'pOyAUCFlWC929-D9dDTtZavkcBQ'
  });
  try {
    const result = await cloudinary.api.resources({ max_results: 100 });
    res.json(result.resources.map(r => ({ id: r.public_id, url: r.secure_url })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TEMPORARY DEBUG ROUTE TO SEED DB
const { exec } = require('child_process');
router.get('/debug/seed', (req, res) => {
  exec('npm run setup', { cwd: require('path').resolve(__dirname, '../../../../') }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    res.json({ stdout });
  });
});

module.exports = router;
