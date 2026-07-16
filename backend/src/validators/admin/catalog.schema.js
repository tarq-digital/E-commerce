const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().max(255).required(),
  slug: Joi.string().max(255).optional(),
  parent_id: Joi.number().integer().allow(null).optional(),
  description: Joi.string().allow("").optional(),
  image_url: Joi.string().uri().allow("").optional(),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").optional(),
  seo_title: Joi.string().max(255).allow("").optional(),
  seo_description: Joi.string().allow("").optional(),
});

const brandSchema = Joi.object({
  name: Joi.string().max(255).required(),
  slug: Joi.string().max(255).optional(),
  description: Joi.string().allow("").optional(),
  logo_url: Joi.string().uri().allow("").optional(),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").optional(),
  seo_title: Joi.string().max(255).allow("").optional(),
  seo_description: Joi.string().allow("").optional(),
});

module.exports = {
  categorySchema,
  brandSchema,
};
