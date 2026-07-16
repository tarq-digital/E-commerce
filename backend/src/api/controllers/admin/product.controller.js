const ProductService = require("../../../modules/catalog/services/product.service");
const { sendSuccess } = require("../../../utils/response");
const httpStatus = require("../../../constants/http-status");
const catchAsync = require("../../../utils/catch-async");

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getProducts(req.query);
  sendSuccess(
    res,
    httpStatus.OK,
    "Products retrieved",
    result.data,
    result.meta,
  );
});

const createProduct = catchAsync(async (req, res) => {
  // If files were uploaded, req.files is populated by multer
  // req.body contains text fields. If it was multipart/form-data, numbers might be strings.

  // Basic parse of JSON fields that arrive as strings
  if (req.body.tags && typeof req.body.tags === "string")
    req.body.tags = JSON.parse(req.body.tags);
  if (req.body.specs && typeof req.body.specs === "string")
    req.body.specs = JSON.parse(req.body.specs);

  const product = await ProductService.createProductWithVariantsAndImages(
    req.body,
    req.files,
    req,
  );
  sendSuccess(res, httpStatus.CREATED, "Product created successfully", product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await ProductService.deleteProduct(req.params.id, req);
  sendSuccess(res, httpStatus.OK, "Product deleted successfully");
});

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
};
