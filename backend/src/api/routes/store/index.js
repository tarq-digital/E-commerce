const express = require('express');
const catalogRoutes = require('./catalog.routes');
const cartRoutes = require('./cart.routes');

const router = express.Router();

router.use('/', catalogRoutes);
router.use('/cart', cartRoutes);

module.exports = router;
