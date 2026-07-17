const { sendSuccess } = require('../../../utils/response');
const httpStatus = require('../../../constants/http-status');
const catchAsync = require('../../../utils/catch-async');
const CartService = require('../../../modules/cart/services/cart.service');

// Helper to extract credentials
const getCredentials = (req) => {
  const userId = req.user?.id || null;
  const cartToken = req.headers['x-guest-cart-token'] || null;
  return { userId, cartToken };
};

const getCart = catchAsync(async (req, res) => {
  const { userId, cartToken } = getCredentials(req);
  const cartData = await CartService.getCart(userId, cartToken);
  
  // Follow standardized API response
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Cart retrieved successfully',
    data: { cart: cartData },
    meta: { warnings: cartData.meta.warnings },
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const addItem = catchAsync(async (req, res) => {
  const { userId, cartToken } = getCredentials(req);
  const { product_id, variant_id, quantity, metadata } = req.body;

  const cartData = await CartService.addItem(userId, cartToken, {
    product_id, variant_id, quantity, metadata
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Item added to cart',
    data: { cart: cartData },
    meta: { warnings: cartData.meta.warnings },
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const updateItem = catchAsync(async (req, res) => {
  const { userId, cartToken } = getCredentials(req);
  const { itemId } = req.params;
  const { quantity } = req.body;

  const cartData = await CartService.updateItemQuantity(userId, cartToken, itemId, quantity);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Cart updated',
    data: { cart: cartData },
    meta: { warnings: cartData.meta.warnings },
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const removeItem = catchAsync(async (req, res) => {
  const { userId, cartToken } = getCredentials(req);
  const { itemId } = req.params;

  const cartData = await CartService.removeItem(userId, cartToken, itemId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Item removed from cart',
    data: { cart: cartData },
    meta: { warnings: cartData?.meta?.warnings || [] },
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const clearCart = catchAsync(async (req, res) => {
  const { userId, cartToken } = getCredentials(req);

  const cartData = await CartService.clearCart(userId, cartToken);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Cart cleared',
    data: { cart: cartData },
    meta: { warnings: [] },
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const mergeCart = catchAsync(async (req, res) => {
  // Requires auth
  const userId = req.user?.id;
  if (!userId) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized',
      errors: ['User must be logged in to merge carts']
    });
  }

  const { guest_cart_token } = req.body;
  if (!guest_cart_token) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Missing guest token',
      errors: ['guest_cart_token is required']
    });
  }

  const cartData = await CartService.mergeGuestCart(guest_cart_token, userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Carts merged successfully',
    data: { cart: cartData },
    meta: { warnings: cartData.meta.warnings },
    errors: null,
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  mergeCart
};
