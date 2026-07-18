const express = require('express');
const orderController = require('../../controllers/store/order.controller');
const { requireAuth } = require('../../../middlewares/auth.middleware');

const router = express.Router();

// Orders are strictly for authenticated users
router.use(requireAuth);

router.get('/', orderController.getCustomerOrders);
router.get('/:id', orderController.getOrderDetails);
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
