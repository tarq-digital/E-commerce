const express = require("express");
const inventoryController = require("../../controllers/admin/inventory.controller");

const router = express.Router();

router.get("/", inventoryController.getInventory);
router.post("/adjust", inventoryController.adjustStock);

module.exports = router;
