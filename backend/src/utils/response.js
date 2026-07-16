/**
 * Standardize success responses
 */
const sendSuccess = (
  res,
  statusCode,
  message,
  data = null,
  meta = undefined,
) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (meta !== undefined) response.meta = meta;

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
};
