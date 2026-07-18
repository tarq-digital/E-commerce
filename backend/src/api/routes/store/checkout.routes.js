const express = require('express');
const checkoutController = require('../../controllers/store/checkout.controller');
const { optionalAuth } = require('../../../middlewares/auth.middleware');

const router = express.Router();

router.use(optionalAuth);

// Unified endpoint: initiates checkout session, sets address, and creates payment order in one step
router.post('/initiate', checkoutController.initiateCheckout);

// Step-by-step endpoints for advanced/multi-step checkout flows
router.get('/:sessionId', checkoutController.getCheckoutState);
router.put('/:sessionId/contact', checkoutController.setContact);
router.put('/:sessionId/address', checkoutController.setAddress);
router.put('/:sessionId/shipping', checkoutController.setShipping);
router.put('/:sessionId/coupon', checkoutController.applyCoupon);

module.exports = router;
