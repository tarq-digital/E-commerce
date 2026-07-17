const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const ROUTES = require("../../constants/routes");

const router = express.Router();

const adminRoutes = require("./admin");
const storeRoutes = require("./store");

// Mount infrastructure routes
router.use(ROUTES?.HEALTH || "/health", healthRoutes);

// Mount authentication routes
router.use(ROUTES?.AUTH || "/auth", authRoutes);

// Mount admin routes (Phase 8 CMS)
router.use(ROUTES?.ADMIN || "/admin", adminRoutes);

// Mount public storefront routes (Phase 9)
router.use(ROUTES?.STORE || "/store", storeRoutes);

module.exports = router;
