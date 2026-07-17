const { sendSuccess } = require('../../../utils/response');
const httpStatus = require('../../../constants/http-status');
const catchAsync = require('../../../utils/catch-async');
const ShippingService = require('../../../modules/checkout/services/shipping.service');

const getShippingMethods = catchAsync(async (req, res) => {
  // Extract subtotal from query to dynamically filter options
  const subtotal = req.query.subtotal ? parseFloat(req.query.subtotal) : 0;
  const methods = await ShippingService.getAvailableMethods(subtotal);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Shipping methods retrieved successfully',
    data: { methods },
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  getShippingMethods
};
