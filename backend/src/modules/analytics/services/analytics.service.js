const AnalyticsRepository = require("../repositories/analytics.repository");

class AnalyticsService {
  /**
   * Retrieves aggregated data for the Executive Dashboard
   */
  async getExecutiveDashboard(filters) {
    const { startDate, endDate } = filters;

    // Parallelize DB calls for performance
    const [kpis, chartData, topProducts, inventoryAlerts] = await Promise.all([
      AnalyticsRepository.getDashboardKpis(startDate, endDate),
      AnalyticsRepository.getSalesChartData(startDate, endDate),
      AnalyticsRepository.getTopProducts(startDate, endDate, 5),
      AnalyticsRepository.getInventoryAlerts(10)
    ]);

    return {
      kpis,
      chart_data: chartData,
      top_products: topProducts,
      inventory_alerts: inventoryAlerts
    };
  }
}

module.exports = new AnalyticsService();
