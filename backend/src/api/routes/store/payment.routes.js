const express = require('express');
const paymentController = require('../../controllers/store/payment.controller');
const { optionalAuth } = require('../../../middlewares/auth.middleware');

const router = express.Router();

// Allow guests to initialize and verify payments using session ID
router.use(optionalAuth);

router.post('/initiate', paymentController.initiatePayment);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
