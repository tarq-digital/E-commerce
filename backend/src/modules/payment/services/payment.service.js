const Razorpay = require('razorpay');
const crypto = require('crypto');
const PaymentRepository = require('../repositories/payment.repository');
const OrderService = require('../../order/services/order.service');
const CheckoutRepository = require('../../checkout/repositories/checkout.repository');
const ApiError = require('../../../utils/api-error');
const httpStatus = require('../../../constants/http-status');

class PaymentService {
  constructor() {
    // In production, these should be verified on startup
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret'
    });
  }

  async initiatePayment(sessionId, idempotencyKey) {
    // 1. Check idempotency
    if (idempotencyKey) {
      const existing = await PaymentRepository.findByIdempotencyKey(idempotencyKey);
      if (existing) return existing;
    }

    // 2. Validate Session
    const session = await CheckoutRepository.findById(sessionId, null, null);
    if (!session) throw new ApiError(httpStatus.NOT_FOUND, 'Checkout session not found');
    if (session.status !== 'SHIPPING_SET' && session.status !== 'PAYMENT_PENDING') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Checkout session is not ready for payment');
    }

    // 3. Create Razorpay Order
    // Amount is strictly backend-calculated and passed in smallest currency unit (paise)
    const amountInPaise = Math.round(session.grand_total * 100);
    
    const options = {
      amount: amountInPaise,
      currency: session.currency || 'INR',
      receipt: session.id, // We map the Razorpay receipt ID to our session ID
      payment_capture: 1
    };

    let rzpOrder;
    try {
      rzpOrder = await this.razorpay.orders.create(options);
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create payment gateway order');
    }

    // 4. Update Session status
    await CheckoutRepository.updatePaymentPending(sessionId, 'razorpay', rzpOrder.id);

    // 5. Create Payment Transaction Record (we create a pending order id as placeholder, actual order created on success)
    const transactionId = crypto.randomUUID();
    const mockOrderId = `pending_ord_${sessionId}`; // Placeholder until payment success converts session to order
    
    await PaymentRepository.createTransaction({
      id: transactionId,
      order_id: mockOrderId, 
      razorpay_order_id: rzpOrder.id,
      amount: session.grand_total,
      currency: session.currency,
      idempotency_key: idempotencyKey
    });

    return {
      razorpay_order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key_id: this.razorpay.key_id // Frontend needs this to open widget
    };
  }

  async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const transaction = await PaymentRepository.findByRazorpayOrderId(razorpayOrderId);
    if (!transaction) throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    if (transaction.status === 'SUCCESS') return transaction; // Already processed

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      await PaymentRepository.updateTransaction(transaction.id, {
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        status: 'FAILED'
      });
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payment signature');
    }

    // Payment is valid! Convert Session to Order.
    const mockOrderId = transaction.order_id;
    const sessionId = mockOrderId.replace('pending_ord_', '');
    
    let realOrderId;
    try {
      realOrderId = await OrderService.convertSessionToOrder(sessionId);
    } catch (error) {
      // If inventory fails here, we should ideally trigger an auto-refund.
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create order post-payment');
    }

    // Link transaction to the real order and mark success
    const pool = require('../../../database/connection');
    await pool.query('UPDATE payment_transactions SET order_id = ?, razorpay_payment_id = ?, razorpay_signature = ?, status = "SUCCESS", updated_at = NOW() WHERE id = ?', 
      [realOrderId, razorpayPaymentId, razorpaySignature, transaction.id]
    );

    transaction.status = 'SUCCESS';
    transaction.order_id = realOrderId;
    return transaction;
  }
}

module.exports = new PaymentService();
