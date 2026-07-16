const multer = require("multer");
const ApiError = require("../../utils/api-error");
const httpStatus = require("../../constants/http-status");
const uploadConfig = require("../../config/upload");

// Store files in memory buffer so they can be streamed directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (uploadConfig.allowedImageFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        httpStatus.BAD_REQUEST,
        `Unsupported file format. Allowed formats: ${uploadConfig.allowedImageFormats.join(", ")}`,
        "INVALID_FILE_FORMAT",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: uploadConfig.maxFileSize,
  },
  fileFilter,
});

// Provides both .single() for logos and .array() for bulk variants
module.exports = {
  uploadSingle: (fieldName) => upload.single(fieldName),
  uploadMultiple: (fieldName, maxCount = 10) =>
    upload.array(fieldName, maxCount),
};
