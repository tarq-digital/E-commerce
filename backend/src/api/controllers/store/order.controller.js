const OrderService = require('../../../modules/order/services/order.service');
const catchAsync = require('../../../utils/catch-async');
const { sendSuccess } = require('../../../utils/response');

const getCustomerOrders = catchAsync(async (req, res) => {
  const { page, limit, status, search } = req.query;
  const result = await OrderService.getCustomerOrders(req.user.id, { page, limit, status, search });
  
  res.status(200).json({
    success: true,
    message: 'Orders retrieved successfully',
    data: result.orders,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit
    },
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const getOrderDetails = catchAsync(async (req, res) => {
  const order = await OrderService.getCustomerOrderDetails(req.params.id, req.user.id);
  
  res.status(200).json({
    success: true,
    message: 'Order details retrieved successfully',
    data: order,
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const cancelOrder = catchAsync(async (req, res) => {
  const result = await OrderService.cancelOrder(req.params.id, req.user.id);
  
  res.status(200).json({
    success: true,
    message: result.message,
    data: null,
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  getCustomerOrders,
  getOrderDetails,
  cancelOrder
};
