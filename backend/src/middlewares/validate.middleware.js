const ApiError = require("../utils/api-error");
const httpStatus = require("../constants/http-status");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Return all errors, not just the first one
    stripUnknown: true, // Remove unknown keys from the validated object
  });

  if (error) {
    const errorDetails = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message.replace(/"/g, ""),
    }));

    const apiError = new ApiError(
      httpStatus.BAD_REQUEST,
      "Validation failed. Please check your inputs.",
      "VALIDATION_ERROR",
    );
    apiError.details = errorDetails;
    return next(apiError);
  }

  // Replace req.body with the sanitized/validated value
  req.body = value;
  return next();
};

module.exports = validate;
