const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const { ROUTES } = require('../../constants');

const router = express.Router();

// Mount infrastructure routes
router.use(ROUTES?.HEALTH || '/health', healthRoutes);

// Mount authentication routes
router.use(ROUTES?.AUTH || '/auth', authRoutes);

// Business routes will be mounted here in Phase 7
// router.use(ROUTES.STORE + '/products', productRoutes);

module.exports = router;
