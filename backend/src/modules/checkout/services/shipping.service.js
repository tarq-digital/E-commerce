const ShippingRepository = require('../repositories/shipping.repository');

class ShippingService {
  async getAvailableMethods(cartSubtotal = 0) {
    const methods = await ShippingRepository.getActiveMethods();
    
    // Filter out methods where min_order_value is strictly greater than the subtotal
    // E.g. "Free shipping for orders > 1000"
    return methods.filter(method => {
      if (method.min_order_value !== null && cartSubtotal < parseFloat(method.min_order_value)) {
        return false;
      }
      return true;
    });
  }
}

module.exports = new ShippingService();
