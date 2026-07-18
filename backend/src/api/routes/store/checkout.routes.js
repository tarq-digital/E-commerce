const express = require('express');
const checkoutController = require('../../controllers/store/checkout.controller');
const { optionalAuth } = require('../../../middlewares/auth.middleware');
const validate = require('../../../middlewares/validate.middleware');
const { initiateCheckoutSchema } = require('../../../validators/store/checkout.schema');

const router = express.Router();

// Checkout requires cart tokens or session logic, handled similarly to carts (optionalAuth)
router.use(optionalAuth);

router.post('/initiate', validate(initiateCheckoutSchema), checkoutController.initiateCheckout);
router.get('/:sessionId', checkoutController.getCheckoutState);
router.put('/:sessionId/contact', checkoutController.setContact);
router.put('/:sessionId/address', checkoutController.setAddress);
router.put('/:sessionId/shipping', checkoutController.setShipping);
router.put('/:sessionId/coupon', checkoutController.applyCoupon);

module.exports = router;
