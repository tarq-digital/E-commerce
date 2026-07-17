const CheckoutRepository = require('../repositories/checkout.repository');
const ShippingRepository = require('../repositories/shipping.repository');
const AddressRepository = require('../../address/repositories/address.repository');
const CartService = require('../../cart/services/cart.service');
const ApiError = require('../../../utils/api-error');
const httpStatus = require('../../../constants/http-status');
const crypto = require('crypto');

class CheckoutService {
  
  async initiateCheckout(userId, cartToken, clientIp, userAgent) {
    // 1. Fetch Cart (this also validates inventory and removes out-of-stock items)
    const cart = await CartService.getCart(userId, cartToken);
    
    if (cart.items.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty or all items are out of stock');
    }

    // 2. Check if an active session already exists for this cart
    const existingSession = await CheckoutRepository.findActiveByCartId(cart.cart_id);
    if (existingSession) {
      // Re-calculate totals just in case prices changed
      await this.recalculateTotals(existingSession.id);
      return existingSession.id;
    }

    // 3. Calculate Totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = 0; // Tax architecture ready for Phase 13
    const shippingTotal = 0; // Not set yet
    const discountTotal = 0; // Coupon architecture ready for Phase 14
    const grandTotal = subtotal + taxTotal + shippingTotal - discountTotal;

    // 4. Create Session UUID
    const sessionId = crypto.randomUUID();

    await CheckoutRepository.createSession({
      id: sessionId,
      cart_id: cart.cart_id,
      user_id: userId,
      guest_token: cartToken,
      currency: cart.currency,
      subtotal,
      tax_total: taxTotal,
      shipping_total: shippingTotal,
      discount_total: discountTotal,
      grand_total: grandTotal,
      status: 'INITIATED',
      client_ip: clientIp,
      user_agent: userAgent
    });

    return sessionId;
  }

  async getCheckoutState(sessionId, userId, guestToken) {
    const session = await CheckoutRepository.findById(sessionId, userId, guestToken);
    if (!session) throw new ApiError(httpStatus.NOT_FOUND, 'Checkout session not found or unauthorized');
    
    // We can also inject the cart items here for the frontend summary
    const cart = await CartService.getCart(session.user_id, session.guest_token);
    
    return {
      session,
      cart_items: cart.items
    };
  }

  async setContact(sessionId, userId, guestToken, { email, phone }) {
    const session = await CheckoutRepository.findById(sessionId, userId, guestToken);
    if (!session) throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');

    if (!email || !phone) throw new ApiError(httpStatus.BAD_REQUEST, 'Email and phone are required for guests');

    await CheckoutRepository.updateContact(sessionId, email, phone);
    return await this.getCheckoutState(sessionId, userId, guestToken);
  }

  async setAddress(sessionId, userId, guestToken, { shipping_address_id, billing_address_id }) {
    const session = await CheckoutRepository.findById(sessionId, userId, guestToken);
    if (!session) throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');

    // For logged in users, fetch address from DB and snapshot it
    if (userId) {
      if (!shipping_address_id) throw new ApiError(httpStatus.BAD_REQUEST, 'Shipping address is required');
      
      const shippingAddress = await AddressRepository.findById(shipping_address_id, userId);
      if (!shippingAddress) throw new ApiError(httpStatus.NOT_FOUND, 'Shipping address not found');
      
      const billingAddress = billing_address_id 
        ? await AddressRepository.findById(billing_address_id, userId)
        : shippingAddress;

      await CheckoutRepository.updateAddresses(sessionId, shippingAddress, billingAddress);
    } else {
      // Guests provide full JSON directly in this architecture (handled in controller)
      throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Guest address setting directly via ID not supported yet');
    }

    return await this.getCheckoutState(sessionId, userId, guestToken);
  }

  async setGuestAddress(sessionId, guestToken, { shipping_address, billing_address }) {
    const session = await CheckoutRepository.findById(sessionId, null, guestToken);
    if (!session) throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');

    if (!shipping_address) throw new ApiError(httpStatus.BAD_REQUEST, 'Shipping address is required');
    
    const billing = billing_address || shipping_address;
    await CheckoutRepository.updateAddresses(sessionId, shipping_address, billing);
    
    return await this.getCheckoutState(sessionId, null, guestToken);
  }

  async setShipping(sessionId, userId, guestToken, { shipping_method_id }) {
    const session = await CheckoutRepository.findById(sessionId, userId, guestToken);
    if (!session) throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');

    const method = await ShippingRepository.findById(shipping_method_id);
    if (!method) throw new ApiError(httpStatus.NOT_FOUND, 'Invalid shipping method');

    // Re-verify min order value
    if (method.min_order_value !== null && session.subtotal < parseFloat(method.min_order_value)) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Cart subtotal does not meet minimum order value for ${method.name}`);
    }

    const grandTotal = parseFloat(session.subtotal) + parseFloat(session.tax_total) + parseFloat(method.price) - parseFloat(session.discount_total);

    await CheckoutRepository.updateShipping(sessionId, method.id, method.price, grandTotal);
    return await this.getCheckoutState(sessionId, userId, guestToken);
  }

  // Internal helper
  async recalculateTotals(sessionId) {
    const session = await CheckoutRepository.findById(sessionId, null, null);
    if (!session) return;
    
    const cart = await CartService.getCart(session.user_id, session.guest_token);
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = parseFloat(session.tax_total); // Phase 13
    const shippingTotal = parseFloat(session.shipping_total);
    const discountTotal = parseFloat(session.discount_total);
    const grandTotal = subtotal + taxTotal + shippingTotal - discountTotal;

    await CheckoutRepository.updateTotals(sessionId, {
      subtotal,
      tax_total: taxTotal,
      shipping_total: shippingTotal,
      discount_total: discountTotal,
      grand_total: grandTotal
    });
  }
}

module.exports = new CheckoutService();
