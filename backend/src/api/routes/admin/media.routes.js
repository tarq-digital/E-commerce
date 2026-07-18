const express = require("express");
const mediaController = require("../../controllers/admin/media.controller");
const multer = require("multer");

const router = express.Router();

// Setup Multer to store file in memory buffer for stream upload to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max size
  },
});

router.get("/folders", mediaController.getFolders);
router.get("/assets", mediaController.getAssets);
router.post("/assets/upload", upload.single("file"), mediaController.uploadAsset);
router.delete("/assets/:id", mediaController.deleteAsset);

module.exports = router;
