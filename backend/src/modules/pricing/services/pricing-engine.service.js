const PromotionRepository = require("../repositories/promotion.repository");

class PricingEngineService {
  /**
   * The Centralized Discount Calculator
   * Returns: { line_discounts: [], cart_discounts: [], coupon_discounts: [], taxable_amount, final_total }
   */
  async calculateDiscounts(cartItems, couponCode = null) {
    let subtotal = 0;
    
    // Normalize line items
    const lines = cartItems.map(item => {
      const lineTotal = Number(item.price) * item.quantity;
      subtotal += lineTotal;
      return {
        ...item,
        line_total: lineTotal,
        discounted_total: lineTotal,
        applied_promotions: []
      };
    });

    let breakdown = {
      subtotal,
      line_discounts: [],
      cart_discounts: [],
      coupon_discounts: [],
      taxable_amount: subtotal,
      final_total: subtotal
    };

    // 1. Gather Context (Active Auto Promos + Requested Coupon)
    const activeAutoPromos = await PromotionRepository.findActiveAutoPromotions();
    let couponPromo = null;
    if (couponCode) {
      couponPromo = await PromotionRepository.findCouponByCode(couponCode);
      if (!couponPromo) {
        throw new Error("Invalid or expired coupon code.");
      }
      if (couponPromo.usage_limit && couponPromo.usage_count >= couponPromo.usage_limit) {
        throw new Error("Coupon usage limit reached.");
      }
      if (subtotal < couponPromo.min_cart_value) {
        throw new Error(`Minimum cart value of ${couponPromo.min_cart_value} required for this coupon.`);
      }
    }

    // Combine all promotions (auto + coupon)
    let applicablePromos = [...activeAutoPromos];
    if (couponPromo) applicablePromos.push(couponPromo);

    // 2. Evaluate Rules (Store, Category, Product)
    // For simplicity in this demo phase, we will process Store-wide and Coupon cart-level.
    // In a full implementation, we'd loop over `lines` and check `target_type` (PRODUCT, CATEGORY).

    let runningCartTotal = subtotal;

    for (const promo of applicablePromos) {
      // Check cart min value
      if (runningCartTotal < promo.min_cart_value) continue;

      let discountAmt = 0;

      if (promo.target_type === 'STORE' || promo.code /* is coupon */) {
        // Cart Level Discount
        if (promo.type === 'FIXED') {
          discountAmt = Number(promo.discount_value);
        } else if (promo.type === 'PERCENTAGE') {
          discountAmt = runningCartTotal * (Number(promo.discount_value) / 100);
          if (promo.max_discount_value && discountAmt > promo.max_discount_value) {
            discountAmt = Number(promo.max_discount_value);
          }
        }
        
        // Cannot discount below zero
        if (discountAmt > runningCartTotal) discountAmt = runningCartTotal;
        runningCartTotal -= discountAmt;

        if (discountAmt > 0) {
           const log = {
              promotion_id: promo.id,
              name: promo.name || promo.code,
              type: promo.code ? 'COUPON' : 'CART_LEVEL',
              amount: discountAmt
           };
           if (promo.code) {
              breakdown.coupon_discounts.push(log);
           } else {
              breakdown.cart_discounts.push(log);
           }
        }
      }
    }

    // 3. Final calculations
    breakdown.taxable_amount = Math.max(0, runningCartTotal);
    breakdown.final_total = breakdown.taxable_amount; // Note: Tax & Shipping added by separate engines later

    return breakdown;
  }
}

module.exports = new PricingEngineService();
