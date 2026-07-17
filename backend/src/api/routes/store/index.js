const express = require('express');
const catalogRoutes = require('./catalog.routes');

const router = express.Router();

router.use('/', catalogRoutes);

module.exports = router;
