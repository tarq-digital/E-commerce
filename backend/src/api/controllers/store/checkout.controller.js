const { sendSuccess } = require('../../../utils/response');
const httpStatus = require('../../../constants/http-status');
const catchAsync = require('../../../utils/catch-async');
const CheckoutService = require('../../../modules/checkout/services/checkout.service');
const CheckoutRepository = require('../../../modules/checkout/repositories/checkout.repository');
const PaymentService = require('../../../modules/payment/services/payment.service');

const getCredentials = (req) => {
  const userId = req.user?.id || null;
  const cartToken = req.headers['x-guest-cart-token'] || null;
  return { userId, cartToken };
};

/**
 * Unified checkout initiation endpoint.
 * Accepts shipping_address, billing_address, and payment_method.
 * Creates a checkout session, sets the address, and creates a Razorpay payment order in one step.
 */
const initiateCheckout = catchAsync(async (req, res) => {
  const { userId, cartToken } = getCredentials(req);
  console.log("=== CHECKOUT INITIATE DEBUG ===");
  console.log("req.headers.authorization:", req.headers.authorization);
  console.log("req.user:", req.user);
  console.log("getCredentials -> userId:", userId, "cartToken:", cartToken);

  const clientIp = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const { shipping_address, billing_address } = req.body;

  // Step 1: Create (or retrieve) checkout session
  let sessionId;
  try {
    sessionId = await CheckoutService.initiateCheckout(userId, cartToken, clientIp, userAgent);
  } catch (e) {
    console.error("CheckoutService.initiateCheckout threw:", e.message);
    throw e;
  }

  // Step 2: Set address on the session (so the order gets address data when payment is confirmed)
  if (shipping_address) {
    const billing = billing_address || shipping_address;
    await CheckoutRepository.updateAddresses(sessionId, shipping_address, billing);
    // Mark session as SHIPPING_SET so PaymentService.initiatePayment allows it
    await CheckoutRepository.updateStatusToShippingSet(sessionId);
  }

  // Step 3: Create the Razorpay payment order
  const idempotencyKey = req.headers['idempotency-key'];
  const paymentData = await PaymentService.initiatePayment(sessionId, idempotencyKey);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Checkout initiated and payment order created',
    data: {
      session_id: sessionId,
      payment: paymentData
    },
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const getCheckoutState = catchAsync(async (req, res) => {
  const { userId, cartToken } = getCredentials(req);
  const { sessionId } = req.params;

  const state = await CheckoutService.getCheckoutState(sessionId, userId, cartToken);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Checkout state retrieved',
    data: state,
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const setContact = catchAsync(async (req, res) => {
  const { userId, cartToken } = getCredentials(req);
  const { sessionId } = req.params;

  const state = await CheckoutService.setContact(sessionId, userId, cartToken, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Contact details set',
    data: state,
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const setAddress = catchAsync(async (req, res) => {
  const { userId, cartToken } = getCredentials(req);
  const { sessionId } = req.params;

  let state;
  if (userId) {
    state = await CheckoutService.setAddress(sessionId, userId, cartToken, req.body);
  } else {
    state = await CheckoutService.setGuestAddress(sessionId, cartToken, req.body);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Address set',
    data: state,
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const setShipping = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  const { method_id } = req.body;
  
  const result = await CheckoutService.setShippingMethod(sessionId, method_id);
  sendSuccess(res, httpStatus.OK, 'Shipping method set successfully', result);
});

const applyCoupon = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  const { coupon_code } = req.body;

  sendSuccess(res, httpStatus.OK, 'Coupon applied to checkout session successfully', { coupon_code });
});

module.exports = {
  initiateCheckout,
  getCheckoutState,
  setContact,
  setAddress,
  setShipping,
  applyCoupon
};
