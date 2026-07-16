const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().max(255).required(),
  slug: Joi.string().max(255).optional(),
  sku: Joi.string().max(100).required(),
  description: Joi.string().allow("").optional(),
  short_description: Joi.string().allow("").optional(),
  category_id: Joi.number().integer().allow(null).optional(),
  brand_id: Joi.number().integer().allow(null).optional(),
  base_price: Joi.number().precision(2).min(0).required(),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").optional(),
  initial_stock: Joi.number().integer().min(0).optional().default(0),
  // Additional JSON strings parsed in controller
  tags: Joi.any().optional(),
  specs: Joi.any().optional(),
});

module.exports = {
  createProductSchema,
};
