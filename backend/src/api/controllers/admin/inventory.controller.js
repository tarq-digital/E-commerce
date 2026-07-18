const InventoryService = require("../../../modules/inventory/services/inventory.service");
const { sendSuccess } = require("../../../utils/response");
const httpStatus = require("../../../constants/http-status");
const catchAsync = require("../../../utils/catch-async");

const getInventory = catchAsync(async (req, res) => {
  const result = await InventoryService.getInventory(req.query);
  sendSuccess(
    res,
    httpStatus.OK,
    "Inventory retrieved",
    result.data,
    result.meta,
  );
});

const getInventoryByVariantId = catchAsync(async (req, res) => {
  const { variantId } = req.params;
  const warehouseId = req.query.warehouse_id ? parseInt(req.query.warehouse_id) : 1;
  const result = await InventoryService.getInventoryByVariantId(variantId, warehouseId);
  sendSuccess(res, httpStatus.OK, "Inventory detail retrieved", result);
});

const adjustStock = catchAsync(async (req, res) => {
  const { variantId } = req.params;
  const { warehouseId, quantity, type, reason } = req.body;
  const result = await InventoryService.adjustStock(
    variantId,
    warehouseId || 1,
    quantity,
    type,
    reason,
    req,
  );
  sendSuccess(res, httpStatus.OK, "Stock adjusted successfully", result);
});

module.exports = {
  getInventory,
  getInventoryByVariantId,
  adjustStock,
};
