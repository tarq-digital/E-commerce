const express = require("express");
const settingsController = require("../../controllers/admin/settings.controller");
const validate = require("../../../middlewares/validate.middleware");
const Joi = require("joi");

const router = express.Router();

const updateSchema = Joi.object({
  updates: Joi.array().items(
    Joi.object({
      key: Joi.string().required(),
      value: Joi.any().required()
    })
  ).required()
});

router.get("/", settingsController.getAllSettings);
router.put("/", validate(updateSchema), settingsController.updateSettings);

module.exports = router;
