const express = require("express");
const customerController = require("../../controllers/admin/customer.controller");
const validate = require("../../../middlewares/validate.middleware");
const Joi = require("joi");

const router = express.Router();

const statusSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'BLOCKED', 'SUSPENDED', 'DEACTIVATED', 'ANONYMIZED').required(),
});

const noteSchema = Joi.object({
  type: Joi.string().valid('GENERAL', 'VIP', 'FRAUD', 'SUPPORT').optional(),
  content: Joi.string().required(),
  isPinned: Joi.boolean().optional(),
});

router.get("/stats", customerController.getDashboardStats);
router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomerById);
router.patch("/:id/status", validate(statusSchema), customerController.updateCustomerStatus);
router.post("/:id/notes", validate(noteSchema), customerController.addNote);

module.exports = router;
