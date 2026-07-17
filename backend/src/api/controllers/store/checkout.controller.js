const { sendSuccess } = require('../../../utils/response');
const httpStatus = require('../../../constants/http-status');
const catchAsync = require('../../../utils/catch-async');
const CheckoutService = require('../../../modules/checkout/services/checkout.service');

const getCredentials = (req) => {
  const userId = req.user?.id || null;
  const cartToken = req.headers['x-guest-cart-token'] || null;
  return { userId, cartToken };
};

const initiateCheckout = catchAsync(async (req, res) => {
  const { userId, cartToken } = getCredentials(req);
  const clientIp = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const sessionId = await CheckoutService.initiateCheckout(userId, cartToken, clientIp, userAgent);
  
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Checkout session initiated',
    data: { session_id: sessionId },
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
  const { userId, cartToken } = getCredentials(req);
  const { sessionId } = req.params;

  const state = await CheckoutService.setShipping(sessionId, userId, cartToken, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Shipping method set',
    data: state,
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  initiateCheckout,
  getCheckoutState,
  setContact,
  setAddress,
  setShipping
};
