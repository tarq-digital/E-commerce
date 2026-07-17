const OrderRepository = require('../repositories/order.repository');
const CheckoutRepository = require('../../checkout/repositories/checkout.repository');
const CartService = require('../../cart/services/cart.service');
const crypto = require('crypto');

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
    // Note: We use raw queries here or inject a repository method.
    const pool = require('../../../database/connection');
    await pool.query('UPDATE checkout_sessions SET status = "COMPLETED" WHERE id = ?', [sessionId]);

    // Inventory reduction would happen here or via a dedicated InventoryService
    // Phase 12.2: Basic inventory decrement logic
    for (const item of cart.items) {
      if (item.variant_id) {
        await pool.query('UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?', [item.quantity, item.variant_id]);
      } else {
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [item.quantity, item.product_id]);
      }
    }

    return orderId;
  }
}

module.exports = new OrderService();
