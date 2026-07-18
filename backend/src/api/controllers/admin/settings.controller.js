const SettingsService = require("../../../modules/settings/services/settings.service");
const { sendSuccess } = require("../../../utils/response");
const httpStatus = require("../../../constants/http-status");
const catchAsync = require("../../../utils/catch-async");

const getAllSettings = catchAsync(async (req, res) => {
  const result = await SettingsService.getAllSettings(req.query.forceRefresh === 'true');
  sendSuccess(res, httpStatus.OK, "Store settings retrieved", result);
});

const updateSettings = catchAsync(async (req, res) => {
  // req.body should be { updates: [{ key: 'STORE_NAME', value: 'My Store' }] }
  const result = await SettingsService.updateSettings(req.body.updates || [], req);
  sendSuccess(res, httpStatus.OK, "Store settings updated successfully", result);
});

module.exports = {
  getAllSettings,
  updateSettings
};
