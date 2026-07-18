const MediaService = require("../../../modules/media/services/media.service");
const { sendSuccess } = require("../../../utils/response");
const httpStatus = require("../../../constants/http-status");
const catchAsync = require("../../../utils/catch-async");

const getFolders = catchAsync(async (req, res) => {
  const result = await MediaService.getFolders(req.query.parentId || null);
  sendSuccess(res, httpStatus.OK, "Media folders retrieved", result);
});

const getAssets = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const folderId = req.query.folderId || null;

  const result = await MediaService.getAssets(folderId, page, limit);
  sendSuccess(res, httpStatus.OK, "Media assets retrieved", result, { page, limit });
});

const uploadAsset = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const folderId = req.body.folderId || null;
  const adminId = req.user?.id;

  const result = await MediaService.processUpload(req.file, folderId, adminId);
  sendSuccess(res, httpStatus.CREATED, "Asset uploaded successfully", result);
});

const deleteAsset = catchAsync(async (req, res) => {
  await MediaService.deleteAsset(req.params.id);
  sendSuccess(res, httpStatus.OK, "Asset deleted successfully", null);
});

module.exports = {
  getFolders,
  getAssets,
  uploadAsset,
  deleteAsset
};
