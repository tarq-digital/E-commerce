const express = require("express");
const promotionController = require("../../controllers/admin/promotion.controller");
const validate = require("../../../middlewares/validate.middleware");
const Joi = require("joi");

const router = express.Router();

const promotionSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  type: Joi.string().valid('FIXED', 'PERCENTAGE').required(),
  discount_value: Joi.number().positive().required(),
  target_type: Joi.string().valid('STORE', 'CATEGORY', 'BRAND', 'PRODUCT').default('STORE'),
  target_id: Joi.number().optional().allow(null),
  is_automatic: Joi.boolean().default(true),
  coupon_code: Joi.string().when('is_automatic', {
      is: false,
      then: Joi.required(),
      otherwise: Joi.optional().allow('')
  }),
  usage_limit: Joi.number().positive().optional().allow(null),
  min_cart_value: Joi.number().min(0).default(0),
  start_date: Joi.date().iso().optional().allow(null),
  end_date: Joi.date().iso().optional().allow(null),
});

router.post("/", validate(promotionSchema), promotionController.createPromotion);
router.get("/", promotionController.getPromotions);

module.exports = router;
