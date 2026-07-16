const express = require("express");
const productController = require("../../controllers/admin/product.controller");
const validate = require("../../../middlewares/validate.middleware");
const {
  createProductSchema,
} = require("../../../validators/admin/product.schema");
const { uploadMultiple } = require("../../../modules/media/upload.config");

const router = express.Router();

router.get("/", productController.getAllProducts);

// Uses multer to parse multipart/form-data and up to 10 images
router.post(
  "/",
  uploadMultiple("images", 10),
  validate(createProductSchema),
  productController.createProduct,
);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
