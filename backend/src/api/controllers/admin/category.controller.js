const CategoryService = require("../../../modules/catalog/services/category.service");
const { sendSuccess } = require("../../../utils/response");
const httpStatus = require("../../../constants/http-status");
const catchAsync = require("../../../utils/catch-async");
const {
  getPaginationParams,
  formatPaginationMeta,
} = require("../../../utils/pagination");

const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getCategories(req.query);
  sendSuccess(
    res,
    httpStatus.OK,
    "Categories retrieved",
    result.data,
    result.meta,
  );
});

const getCategory = catchAsync(async (req, res) => {
  const category = await CategoryService.getCategoryById(req.params.id);
  sendSuccess(res, httpStatus.OK, "Category retrieved", category);
});

const createCategory = catchAsync(async (req, res) => {
  const category = await CategoryService.createCategory(req.body, req);
  sendSuccess(
    res,
    httpStatus.CREATED,
    "Category created successfully",
    category,
  );
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await CategoryService.updateCategory(
    req.params.id,
    req.body,
    req,
  );
  sendSuccess(res, httpStatus.OK, "Category updated successfully", category);
});

const deleteCategory = catchAsync(async (req, res) => {
  await CategoryService.deleteCategory(req.params.id, req);
  sendSuccess(res, httpStatus.OK, "Category deleted successfully");
});

const restoreCategory = catchAsync(async (req, res) => {
  const category = await CategoryService.restoreCategory(req.params.id, req);
  sendSuccess(res, httpStatus.OK, "Category restored successfully", category);
});

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
};
