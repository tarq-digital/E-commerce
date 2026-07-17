const express = require('express');
const webhookController = require('../controllers/webhooks.controller');

const router = express.Router();

// Webhook payloads from Razorpay are raw JSON or application/json.
// The main server.js parses JSON globally, but we might need raw bodies for 
// accurate signature verification if strict. In this app, we are parsing stringified req.body.
router.post('/razorpay', webhookController.razorpayWebhook);

module.exports = router;
