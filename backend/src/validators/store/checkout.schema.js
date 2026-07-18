const Joi = require('joi');

const addressSchema = Joi.object({
  phone: Joi.string().min(10).required(),
  line1: Joi.string().min(1).required(),
  line2: Joi.string().optional().allow('', null),
  city: Joi.string().min(1).required(),
  state: Joi.string().min(1).required(),
  pincode: Joi.string().min(1).required(),
});

const initiateCheckoutSchema = Joi.object({
  shipping_address: addressSchema.required(),
  billing_address: addressSchema.optional().allow(null),
  payment_method: Joi.string().optional().allow('', null),
  notes: Joi.string().optional().allow('', null)
});

module.exports = {
  initiateCheckoutSchema
};
