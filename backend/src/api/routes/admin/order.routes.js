const express = require("express");
const orderController = require("../../controllers/admin/order.controller");
const validate = require("../../../middlewares/validate.middleware");
const Joi = require("joi");

const router = express.Router();

const statusSchema = Joi.object({
  status: Joi.string().valid(
    'ORDER_CREATED', 'CONFIRMED', 'PACKED', 'READY_TO_SHIP', 'SHIPPED', 
    'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 
    'RETURN_APPROVED', 'RETURNED', 'REFUND_PENDING', 'REFUNDED'
  ).required()
});

const noteSchema = Joi.object({
  notes: Joi.string().required()
});

const holdSchema = Joi.object({
  is_on_hold: Joi.boolean().required(),
  hold_reason: Joi.string().allow('', null)
});

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", validate(statusSchema), orderController.updateOrderStatus);
router.post("/:id/timeline", validate(noteSchema), orderController.addInternalNote);
router.patch("/:id/hold", validate(holdSchema), orderController.toggleHoldStatus);

module.exports = router;
