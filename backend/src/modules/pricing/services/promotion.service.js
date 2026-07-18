const PromotionRepository = require("../repositories/promotion.repository");
const ApiError = require("../../../utils/api-error");
const httpStatus = require("../../../constants/http-status");

class PromotionService {
  async createPromotion(data) {
    // Basic validation
    if (!data.name || !data.type || !data.discount_value) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Missing required promotion fields");
    }

    // 1. Create Promotion Rule
    const promotionId = await PromotionRepository.createPromotion(data);

    // 2. If it is a coupon, generate the coupon code
    if (!data.is_automatic && data.coupon_code) {
      await PromotionRepository.createCoupon(promotionId, data.coupon_code, data.usage_limit);
    }

    return { id: promotionId, message: "Promotion created successfully" };
  }

  async getPromotions(queryParams) {
    return await PromotionRepository.findAll(queryParams);
  }
}

module.exports = new PromotionService();
