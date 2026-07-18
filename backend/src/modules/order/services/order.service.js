const OrderRepository = require('../repositories/order.repository');
const CheckoutRepository = require('../../checkout/repositories/checkout.repository');
const TimelineService = require('./timeline.service');
const CartService = require('../../cart/services/cart.service');
const crypto = require('crypto');
const ApiError = require('../../../utils/api-error');
const httpStatus = require('../../../constants/http-status');
const pool = require('../../../database/connection');

class OrderService {
  async convertSessionToOrder(sessionId) {
    const session = await CheckoutRepository.findById(sessionId, null, null);
    if (!session) throw new Error('Session not found');

    // Prevent duplicate conversion
    if (session.status === 'COMPLETED') {
      throw new Error('Session already converted to order');
    }

    const cart = await CartService.getCart(session.user_id, session.guest_token);
    
    const orderId = crypto.randomUUID();
    
    // Create the Order and Order Items
    await OrderRepository.createOrder({
      id: orderId,
      user_id: session.user_id,
      checkout_session_id: session.id,
      status: 'PAID',
      currency: session.currency,
      subtotal: session.subtotal,
      tax_total: session.tax_total,
      shipping_total: session.shipping_total,
      discount_total: session.discount_total,
      grand_total: session.grand_total,
      shipping_address_json: session.shipping_address_json,
      billing_address_json: session.billing_address_json,
      contact_email: session.contact_email,
      contact_phone: session.contact_phone
    }, cart.items);

    // Clear the cart
    await CartService.clearCart(session.user_id, session.guest_token);

    // Mark session as completed
    await pool.query('UPDATE checkout_sessions SET status = "COMPLETED" WHERE id = ?', [sessionId]);

    // Inventory reduction
    for (const item of cart.items) {
      if (item.variant_id) {
        await pool.query('UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?', [item.quantity, item.variant_id]);
      } else {
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [item.quantity, item.product_id]);
      }
    }

    // Add initial timeline event
    await TimelineService.logTransition(orderId, null, 'PAID', 'SYSTEM', null);

    return orderId;
  }

  async getCustomerOrders(userId, queryParams) {
    return await OrderRepository.findAllByUserId(userId, queryParams);
  }

  async getCustomerOrderDetails(orderId, userId) {
    const order = await OrderRepository.findById(orderId, userId);
    if (!order) throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    
    // Attach timeline history
    order.timeline = await TimelineService.getOrderTimeline(orderId);
    return order;
  }

  async cancelOrder(orderId, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const order = await OrderRepository.findById(orderId, userId);
      if (!order) throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');

      // State Machine Validation
      if (!['PENDING', 'PAID', 'PROCESSING', 'CONFIRMED'].includes(order.status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Order cannot be cancelled in ${order.status} state`);
      }

      await OrderRepository.updateStatus(orderId, 'CANCELLED', connection);
      
      // Log Cancellation Timeline
      await TimelineService.logTransition(
        orderId, order.status, 'CANCELLED', 'CUSTOMER', userId, null, connection
      );

      // (Optional) Reverse Inventory logic would go here

      await connection.commit();
      return { success: true, message: 'Order successfully cancelled' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new OrderService();
