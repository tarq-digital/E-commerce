const PromotionService = require("../../../modules/pricing/services/promotion.service");
const { sendSuccess } = require("../../../utils/response");
const httpStatus = require("../../../constants/http-status");
const catchAsync = require("../../../utils/catch-async");

const createPromotion = catchAsync(async (req, res) => {
  const result = await PromotionService.createPromotion(req.body);
  sendSuccess(res, httpStatus.CREATED, "Promotion created successfully", result);
});

const getPromotions = catchAsync(async (req, res) => {
  const result = await PromotionService.getPromotions(req.query);
  sendSuccess(
    res,
    httpStatus.OK,
    "Promotions retrieved",
    result.data,
    result.meta,
  );
});

module.exports = {
  createPromotion,
  getPromotions,
};
