const BrandService = require("../../../modules/catalog/services/brand.service");
const { sendSuccess } = require("../../../utils/response");
const httpStatus = require("../../../constants/http-status");
const catchAsync = require("../../../utils/catch-async");

const getAllBrands = catchAsync(async (req, res) => {
  const result = await BrandService.getBrands(req.query);
  sendSuccess(res, httpStatus.OK, "Brands retrieved", result.data, result.meta);
});

const getBrand = catchAsync(async (req, res) => {
  const brand = await BrandService.getBrandById(req.params.id);
  sendSuccess(res, httpStatus.OK, "Brand retrieved", brand);
});

const createBrand = catchAsync(async (req, res) => {
  const brand = await BrandService.createBrand(req.body, req);
  sendSuccess(res, httpStatus.CREATED, "Brand created successfully", brand);
});

const updateBrand = catchAsync(async (req, res) => {
  const brand = await BrandService.updateBrand(req.params.id, req.body, req);
  sendSuccess(res, httpStatus.OK, "Brand updated successfully", brand);
});

const deleteBrand = catchAsync(async (req, res) => {
  await BrandService.deleteBrand(req.params.id, req);
  sendSuccess(res, httpStatus.OK, "Brand deleted successfully");
});

const restoreBrand = catchAsync(async (req, res) => {
  const brand = await BrandService.restoreBrand(req.params.id, req);
  sendSuccess(res, httpStatus.OK, "Brand restored successfully", brand);
});

module.exports = {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  restoreBrand,
};
