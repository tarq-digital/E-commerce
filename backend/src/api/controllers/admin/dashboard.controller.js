const DashboardService = require('../../../modules/admin/services/dashboard.service');
const catchAsync = require('../../../utils/catch-async');

const getDashboardOverview = catchAsync(async (req, res) => {
  const { dateRange } = req.query; // e.g., 'today', 'last_7_days', etc.
  
  const data = await DashboardService.getDashboardStats(dateRange);

  res.status(200).json({
    success: true,
    message: 'Dashboard stats retrieved successfully',
    data,
    meta: {
      dateRange: dateRange || 'all_time'
    },
    errors: null,
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  getDashboardOverview
};
