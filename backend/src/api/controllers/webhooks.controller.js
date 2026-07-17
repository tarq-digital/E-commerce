const { sendSuccess } = require('../../utils/response');
const crypto = require('crypto');
const PaymentService = require('../../modules/payment/services/payment.service');
const PaymentRepository = require('../../modules/payment/repositories/payment.repository');
const OrderService = require('../../modules/order/services/order.service');

const razorpayWebhook = async (req, res) => {
  // Webhooks do not use catchAsync so we can cleanly return 200 to Razorpay even on error 
  // (unless we want them to retry, but we usually log and ignore)
  
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_webhook_secret';
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid Razorpay Webhook Signature');
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;
      
      const transaction = await PaymentRepository.findByRazorpayOrderId(razorpayOrderId);
      
      if (transaction && transaction.status !== 'SUCCESS') {
        // Fallback processing if frontend missed the callback
        console.log(`Webhook fallback converting session to order for RZP Order: ${razorpayOrderId}`);
        
        const mockOrderId = transaction.order_id;
        const sessionId = mockOrderId.replace('pending_ord_', '');
        
        try {
          const realOrderId = await OrderService.convertSessionToOrder(sessionId);
          const pool = require('../../database/connection');
          await pool.query('UPDATE payment_transactions SET order_id = ?, razorpay_payment_id = ?, status = "SUCCESS", updated_at = NOW() WHERE id = ?', 
            [realOrderId, razorpayPaymentId, transaction.id]
          );
        } catch (err) {
          console.error('Webhook failed to create order:', err);
        }
      }
    } else if (event === 'payment.failed') {
      const razorpayOrderId = payload.payment.entity.order_id;
      const transaction = await PaymentRepository.findByRazorpayOrderId(razorpayOrderId);
      if (transaction) {
        await PaymentRepository.updateTransaction(transaction.id, {
          razorpay_payment_id: payload.payment.entity.id,
          razorpay_signature: null,
          status: 'FAILED'
        });
      }
    }

    // Always return 200 OK so Razorpay knows we received it
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal Error');
  }
};

module.exports = {
  razorpayWebhook
};
