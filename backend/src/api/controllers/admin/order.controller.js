const OrderAdminService = require("../../../modules/order/services/order-admin.service");
const { sendSuccess } = require("../../../utils/response");
const httpStatus = require("../../../constants/http-status");
const catchAsync = require("../../../utils/catch-async");

const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderAdminService.getOrders(req.query);
  sendSuccess(
    res,
    httpStatus.OK,
    "Orders retrieved successfully",
    result.data,
    result.meta
  );
});

const getOrderById = catchAsync(async (req, res) => {
  const order = await OrderAdminService.getOrderById(req.params.id);
  sendSuccess(res, httpStatus.OK, "Order retrieved successfully", order);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const order = await OrderAdminService.updateOrderStatus(req.params.id, status, req);
  sendSuccess(res, httpStatus.OK, "Order status updated successfully", order);
});

const addInternalNote = catchAsync(async (req, res) => {
  const { notes } = req.body;
  const order = await OrderAdminService.addInternalNote(req.params.id, notes, req);
  sendSuccess(res, httpStatus.OK, "Internal note added successfully", order);
});

const toggleHoldStatus = catchAsync(async (req, res) => {
  const { is_on_hold, hold_reason } = req.body;
  const order = await OrderAdminService.toggleHoldStatus(req.params.id, is_on_hold, hold_reason, req);
  sendSuccess(res, httpStatus.OK, "Hold status updated successfully", order);
});

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  addInternalNote,
  toggleHoldStatus
};
