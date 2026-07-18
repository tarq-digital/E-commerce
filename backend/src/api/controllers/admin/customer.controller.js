const CustomerService = require("../../../modules/crm/services/customer.service");
const { sendSuccess } = require("../../../utils/response");
const httpStatus = require("../../../constants/http-status");
const catchAsync = require("../../../utils/catch-async");

const getCustomers = catchAsync(async (req, res) => {
  const result = await CustomerService.getCustomers(req.query);
  sendSuccess(
    res,
    httpStatus.OK,
    "Customers retrieved",
    result.data,
    result.meta,
  );
});

const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await CustomerService.getDashboardStats();
  sendSuccess(res, httpStatus.OK, "Dashboard stats retrieved", stats);
});

const getCustomerById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CustomerService.getCustomerById(id);
  sendSuccess(res, httpStatus.OK, "Customer detail retrieved", result);
});

const updateCustomerStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await CustomerService.updateCustomerStatus(id, status, req);
  sendSuccess(res, httpStatus.OK, "Customer status updated", result);
});

const addNote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CustomerService.addNote(id, req.body, req);
  sendSuccess(res, httpStatus.CREATED, "Note added successfully", result);
});

module.exports = {
  getCustomers,
  getDashboardStats,
  getCustomerById,
  updateCustomerStatus,
  addNote
};
