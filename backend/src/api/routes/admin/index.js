const express = require("express");
const {
  requireAuth,
  requireRole,
} = require("../../../middlewares/auth.middleware");

const categoryRoutes = require("./category.routes");
const brandRoutes = require("./brand.routes");
const productRoutes = require("./product.routes");
const inventoryRoutes = require("./inventory.routes");
const dashboardRoutes = require("./dashboard.routes");
const orderRoutes = require("./order.routes");
const customerRoutes = require("./customer.routes");
const promotionRoutes = require("./promotion.routes");
const analyticsRoutes = require("./analytics.routes");

const router = express.Router();

// ALL admin routes require authentication and ADMIN role
router.use(requireAuth);
router.use(requireRole("ADMIN"));

router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/orders", orderRoutes);
router.use("/customers", customerRoutes);
router.use("/promotions", promotionRoutes);
router.use("/analytics", analyticsRoutes);

module.exports = router;
