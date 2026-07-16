const Joi = require("joi");

const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(100),
  last_name: Joi.string().min(2).max(100),
})
  .min(1)
  .messages({
    "object.min": "You must provide at least one field to update",
  });

module.exports = updateProfileSchema;
