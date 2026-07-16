const Joi = require("joi");

const registerSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).required().messages({
    "string.min": "First name must be at least 2 characters long",
    "any.required": "First name is required",
  }),
  last_name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Last name must be at least 2 characters long",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
      "any.required": "Password is required",
    }),
});

module.exports = registerSchema;
