const express = require("express");
const brandController = require("../../controllers/admin/brand.controller");
const validate = require("../../../middlewares/validate.middleware");
const { brandSchema } = require("../../../validators/admin/catalog.schema");

const router = express.Router();

router.get("/", brandController.getAllBrands);
router.get("/:id", brandController.getBrand);
router.post("/", validate(brandSchema), brandController.createBrand);

const updateSchema = brandSchema.fork(
  Object.keys(brandSchema.describe().keys),
  (schema) => schema.optional(),
);
router.patch("/:id", validate(updateSchema), brandController.updateBrand);

router.delete("/:id", brandController.deleteBrand);
router.post("/:id/restore", brandController.restoreBrand);

module.exports = router;
