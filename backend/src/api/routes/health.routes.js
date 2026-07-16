const express = require('express');
const os = require('os');
const pool = require('../../database/connection');
const { sendSuccess } = require('../../utils/response');
const httpStatus = require('../../constants/http-status');
const catchAsync = require('../../utils/catch-async');

const router = express.Router();

router.get('/', (req, res) => {
  sendSuccess(res, httpStatus.OK, 'API is running successfully');
});

router.get('/ready', catchAsync(async (req, res) => {
  // Verify database connection is alive
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();

  sendSuccess(res, httpStatus.OK, 'System is Ready', {
    database: 'connected',
    status: 'ok',
  });
}));

router.get('/live', (req, res) => {
  sendSuccess(res, httpStatus.OK, 'System is Live');
});

router.get('/version', (req, res) => {
  sendSuccess(res, httpStatus.OK, 'Version Info', {
    version: '1.0.0',
    node: process.version,
  });
});

router.get('/metrics', (req, res) => {
  sendSuccess(res, httpStatus.OK, 'System Metrics', {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuLoad: os.loadavg(),
  });
});

module.exports = router;
