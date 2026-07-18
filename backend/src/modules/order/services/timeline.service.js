const TimelineRepository = require('../repositories/timeline.repository');
const { orderEvents, ORDER_EVENTS } = require('../events/order.events');

class TimelineService {
  /**
   * Internal service method to append a status and emit events
   * Must be wrapped in a transaction if mutating order rows simultaneously
   */
  async logTransition(orderId, oldStatus, newStatus, actorType, actorId, ipAddress = null, connection = null) {
    // 1. Add customer-facing timeline note
    const notes = this.generateCustomerNote(newStatus);
    await TimelineRepository.addEntry(orderId, newStatus, notes, actorType, actorId, connection);

    // 2. Add strict internal audit log
    await TimelineRepository.addAuditLog(
      orderId, 'STATUS_UPDATE', oldStatus, newStatus, actorType, actorId, ipAddress, connection
    );

    // 3. Emit Async Event for plugins (Email/SMS)
    orderEvents.emit(ORDER_EVENTS.STATUS_CHANGED, {
      orderId,
      previousStatus: oldStatus,
      newStatus,
      actorType
    });
  }

  async getOrderTimeline(orderId) {
    return await TimelineRepository.getTimelineByOrderId(orderId);
  }

  generateCustomerNote(status) {
    const messages = {
      'PENDING': 'Order is pending payment verification.',
      'PAID': 'Payment received successfully. We are preparing your order.',
      'PROCESSING': 'Your order is currently being packed.',
      'SHIPPED': 'Your order has been shipped.',
      'OUT_FOR_DELIVERY': 'Your order is out for delivery today!',
      'DELIVERED': 'Order has been delivered. Enjoy!',
      'CANCELLED': 'Order was cancelled.',
      'REFUNDED': 'Refund has been processed.'
    };
    return messages[status] || 'Order status updated.';
  }
}

module.exports = new TimelineService();
