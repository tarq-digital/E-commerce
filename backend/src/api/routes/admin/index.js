const express = require("express");
const {
  requireAuth,
  requireRole,
} = require("../../../middlewares/auth.middleware");

const categoryRoutes = require("./category.routes");
const brandRoutes = require("./brand.routes");
const productRoutes = require("./product.routes");
const inventoryRoutes = require("./inventory.routes");

const router = express.Router();

// ALL admin routes require authentication and ADMIN role
router.use(requireAuth);
router.use(requireRole("ADMIN"));

router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);

module.exports = router;
