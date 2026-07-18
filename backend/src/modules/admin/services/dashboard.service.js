const DashboardRepository = require('../repositories/dashboard.repository');

class DashboardService {
  async getDashboardStats(dateRange) {
    // Phase 13.1 parallel query aggregation
    const [stats, recentOrders, recentActivities] = await Promise.all([
      DashboardRepository.getSummaryStats(dateRange),
      DashboardRepository.getRecentOrders(5),
      DashboardRepository.getRecentActivities(10)
    ]);

    return {
      stats: {
        total_revenue: parseFloat(stats.total_revenue || 0),
        total_orders: parseInt(stats.total_orders || 0, 10),
        active_products: parseInt(stats.active_products || 0, 10),
        total_customers: parseInt(stats.total_customers || 0, 10)
      },
      recent_orders: recentOrders,
      recent_activities: recentActivities
    };
  }
}

module.exports = new DashboardService();
