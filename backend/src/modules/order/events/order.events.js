const EventEmitter = require('events');
const classEmitter = new EventEmitter();

// Define standard order events
const ORDER_EVENTS = {
  STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  CREATED: 'ORDER_CREATED',
  CANCELLED: 'ORDER_CANCELLED',
  PAYMENT_FAILED: 'ORDER_PAYMENT_FAILED'
};

// Placeholder listener for Analytics / Notifications
classEmitter.on(ORDER_EVENTS.STATUS_CHANGED, (payload) => {
  console.log(`[EVENT] Order ${payload.orderId} status changed from ${payload.previousStatus} to ${payload.newStatus}`);
  // In future: EmailService.sendOrderStatusUpdate(payload.orderId, payload.newStatus);
});

module.exports = {
  orderEvents: classEmitter,
  ORDER_EVENTS
};
