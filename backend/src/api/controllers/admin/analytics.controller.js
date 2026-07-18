const AnalyticsService = require("../../../modules/analytics/services/analytics.service");
const ExportService = require("../../../modules/analytics/services/export.service");
const { sendSuccess } = require("../../../utils/response");
const httpStatus = require("../../../constants/http-status");
const catchAsync = require("../../../utils/catch-async");
const AnalyticsRepository = require("../../../modules/analytics/repositories/analytics.repository"); // Needed for raw data in export

const getDashboard = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const result = await AnalyticsService.getExecutiveDashboard({ startDate, endDate });
  sendSuccess(res, httpStatus.OK, "Analytics dashboard retrieved", result);
});

const exportReport = catchAsync(async (req, res) => {
  const { reportType } = req.params;
  const { startDate, endDate } = req.query;
  
  let dataToExport = [];

  // Fetch the data based on report type
  if (reportType === 'SALES_REPORT') {
      dataToExport = await AnalyticsRepository.getSalesChartData(startDate, endDate);
  } else if (reportType === 'PRODUCT_REPORT') {
      dataToExport = await AnalyticsRepository.getTopProducts(startDate, endDate, 50); // Export top 50
  } else {
      return res.status(400).json({ success: false, message: "Invalid report type" });
  }

  const csv = await ExportService.exportCsv(
      reportType,
      dataToExport,
      { startDate, endDate },
      req
  );

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${reportType.toLowerCase()}_${new Date().getTime()}.csv`);
  res.send(csv);
});

module.exports = {
  getDashboard,
  exportReport
};
