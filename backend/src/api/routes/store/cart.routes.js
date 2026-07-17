const express = require('express');
const cartController = require('../../controllers/store/cart.controller');
// We need an optional auth middleware. If it exists, req.user will be populated.
// Since this is a public store route, we don't strict-enforce auth on most routes, 
// but we do extract the user if the token is valid.
const { optionalAuth, requireAuth } = require('../../../middlewares/auth.middleware');

const router = express.Router();

// All cart routes (except merge) use optionalAuth to extract req.user if a token is present
router.use(optionalAuth);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

// Merge requires strict authentication
router.post('/merge', requireAuth, cartController.mergeCart);

module.exports = router;
