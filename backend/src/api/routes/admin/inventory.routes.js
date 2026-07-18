const express = require("express");
const inventoryController = require("../../controllers/admin/inventory.controller");
const validate = require("../../../middlewares/validate.middleware");
const Joi = require("joi");

const router = express.Router();

const adjustSchema = Joi.object({
  warehouseId: Joi.number().optional(),
  quantity: Joi.number().required(),
  type: Joi.string().valid('IN', 'OUT', 'ADJUSTMENT').required(),
  reason: Joi.string().required()
});

router.get("/", inventoryController.getInventory);
router.get("/:variantId", inventoryController.getInventoryByVariantId);
router.post("/:variantId/adjust", validate(adjustSchema), inventoryController.adjustStock);

module.exports = router;
