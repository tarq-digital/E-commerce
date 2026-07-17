const express = require('express');
const shippingController = require('../../controllers/store/shipping.controller');
// We use optionalAuth since guests can query shipping rates too
const { optionalAuth } = require('../../../middlewares/auth.middleware');

const router = express.Router();

router.use(optionalAuth);
router.get('/', shippingController.getShippingMethods);

module.exports = router;
