const AnalyticsRepository = require("../repositories/analytics.repository");

class ExportService {
  /**
   * Generates a CSV string from data and logs the action
   */
  async exportCsv(reportType, data, filters, req) {
    if (!data || !data.length) {
      throw new Error("No data available to export");
    }

    // Custom CSV Serializer to avoid installing external dependencies
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        // Handle strings with commas, quotes, or newlines
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val !== null && val !== undefined ? val : '';
      });
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');

    // Audit Logging
    const adminId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    await AnalyticsRepository.logExport(
      adminId, 
      reportType, 
      'CSV', 
      filters, 
      ipAddress
    );

    return csvData;
  }
}

module.exports = new ExportService();
