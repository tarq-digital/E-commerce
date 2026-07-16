const express = require('express');
const healthRoutes = require('./health.routes');
const { ROUTES } = require('../../constants');

const router = express.Router();

// Mount infrastructure routes
router.use(ROUTES?.HEALTH || '/health', healthRoutes);

// Business routes will be mounted here in Phase 7
// router.use(ROUTES.AUTH, authRoutes);
// router.use(ROUTES.STORE + '/products', productRoutes);

module.exports = router;
