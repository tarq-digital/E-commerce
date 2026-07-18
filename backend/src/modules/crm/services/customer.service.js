const CustomerRepository = require("../repositories/customer.repository");
const AuditRepository = require("../../../database/repositories/audit.repository");
const ApiError = require("../../../utils/api-error");
const httpStatus = require("../../../constants/http-status");

class CustomerService {
  async getCustomers(queryParams) {
    return await CustomerRepository.findAll(queryParams);
  }

  async getCustomerById(id) {
    const customer = await CustomerRepository.findById(id);
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
    }
    return customer;
  }

  async updateCustomerStatus(id, status, req) {
    const customer = await this.getCustomerById(id);
    
    // Status validation
    const validStatuses = ['ACTIVE', 'BLOCKED', 'SUSPENDED', 'DEACTIVATED', 'ANONYMIZED'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid account status");
    }

    await CustomerRepository.updateStatus(id, status);

    AuditRepository.logAction(
      req.user.id,
      "CUSTOMER_STATUS_UPDATED",
      { customer_id: id, old_status: customer.account_status, new_status: status },
      req.ip,
    );

    return { message: "Status updated successfully" };
  }

  async addNote(id, noteData, req) {
    const { type, content, isPinned } = noteData;
    
    await this.getCustomerById(id); // Verify existence

    await CustomerRepository.addNote(id, req.user.id, type || 'GENERAL', content, isPinned || false);

    AuditRepository.logAction(
      req.user.id,
      "CUSTOMER_NOTE_ADDED",
      { customer_id: id, type },
      req.ip,
    );

    return { message: "Note added successfully" };
  }

  async getDashboardStats() {
      return await CustomerRepository.getDashboardStats();
  }
}

module.exports = new CustomerService();
