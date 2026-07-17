const express = require('express');
const catalogRoutes = require('./catalog.routes');
const cartRoutes = require('./cart.routes');
const addressRoutes = require('./address.routes');
const shippingRoutes = require('./shipping.routes');
const checkoutRoutes = require('./checkout.routes');

const router = express.Router();

router.use('/', catalogRoutes);
router.use('/cart', cartRoutes);
router.use('/addresses', addressRoutes);
router.use('/shipping-methods', shippingRoutes);
router.use('/checkout', checkoutRoutes);

module.exports = router;
