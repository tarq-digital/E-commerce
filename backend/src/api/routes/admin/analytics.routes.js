const express = require("express");
const analyticsController = require("../../controllers/admin/analytics.controller");
const validate = require("../../../middlewares/validate.middleware");
const Joi = require("joi");

const router = express.Router();

const dateFilterSchema = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
});

router.get("/dashboard", validate(dateFilterSchema, 'query'), analyticsController.getDashboard);
router.get("/export/:reportType", validate(dateFilterSchema, 'query'), analyticsController.exportReport);

module.exports = router;
