const { sendSuccess } = require('../../../utils/response');
const httpStatus = require('../../../constants/http-status');
const catchAsync = require('../../../utils/catch-async');
const PaymentService = require('../../../modules/payment/services/payment.service');

const initiatePayment = catchAsync(async (req, res) => {
  const { session_id } = req.body;
  const idempotencyKey = req.headers['idempotency-key'];

  const orderData = await PaymentService.initiatePayment(session_id, idempotencyKey);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Payment gateway initialized',
    data: orderData,
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const transaction = await PaymentService.verifyPayment(
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Payment verified and order created',
    data: { order_id: transaction.order_id },
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  initiatePayment,
  verifyPayment
};
