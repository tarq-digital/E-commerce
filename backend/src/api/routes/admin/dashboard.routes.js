const express = require('express');
const dashboardController = require('../../controllers/admin/dashboard.controller');
const { requirePermission } = require('../../../middlewares/auth.middleware');

const router = express.Router();

// The index router already requires auth and ADMIN roles, 
// so here we just add the specific permission check.
router.use(requirePermission('READ_DASHBOARD'));

router.get('/stats', dashboardController.getDashboardOverview);

module.exports = router;
