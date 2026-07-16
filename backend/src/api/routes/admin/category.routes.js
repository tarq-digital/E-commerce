const express = require("express");
const categoryController = require("../../controllers/admin/category.controller");
const validate = require("../../../middlewares/validate.middleware");
const { categorySchema } = require("../../../validators/admin/catalog.schema");

const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", validate(categorySchema), categoryController.createCategory);

// We could use an update schema, but keeping it simple by making all fields optional in update
const updateSchema = categorySchema.fork(
  Object.keys(categorySchema.describe().keys),
  (schema) => schema.optional(),
);
router.patch("/:id", validate(updateSchema), categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);
router.post("/:id/restore", categoryController.restoreCategory);

module.exports = router;
