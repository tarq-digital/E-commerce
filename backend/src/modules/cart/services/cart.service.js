const CartRepository = require('../repositories/cart.repository');
const ProductRepository = require('../../catalog/repositories/product.repository');
const PricingEngineService = require('../../pricing/services/pricing-engine.service');

class CartService {
  
  async getCart(userId = null, cartToken = null) {
    let cart = await CartRepository.getActiveCart(userId, cartToken);
    
    // If no cart exists, return empty structure
    if (!cart) {
      return { items: [], meta: { warnings: [] } };
    }

    const items = await CartRepository.getCartItems(cart.id);
    
    console.log("User ID", userId);
    console.log("Guest Token", cartToken);
    console.log("Cart", cart);
    console.log("Items from DB:", items);

    const warnings = [];
    let requiresDbUpdate = false;

    // Validate and map items
    const validatedItems = [];
    
    for (const item of items) {
      // Check if product is inactive or deleted
      if (item.product_status !== 'PUBLISHED' || item.variant_deleted !== null) {
        warnings.push({
          type: 'item_unavailable',
          message: `The item ${item.product_snapshot_name} is no longer available and was removed from your cart.`,
          product_id: item.product_id
        });
        await CartRepository.removeCartItem(item.cart_item_id);
        requiresDbUpdate = true;
        continue; // Skip adding to validated items
      }

      // Check stock limits
      const maxStock = item.available_stock || 0;
      let finalQuantity = item.quantity;
      
      if (maxStock <= 0) {
        warnings.push({
          type: 'out_of_stock',
          message: `The item ${item.product_snapshot_name} is currently out of stock and was removed from your cart.`,
          product_id: item.product_id
        });
        await CartRepository.removeCartItem(item.cart_item_id);
        requiresDbUpdate = true;
        continue;
      } else if (item.quantity > maxStock) {
        warnings.push({
          type: 'inventory_adjusted',
          message: `Only ${maxStock} units of ${item.product_snapshot_name} are available. Your quantity has been adjusted.`,
          product_id: item.product_id
        });
        finalQuantity = maxStock;
        await CartRepository.updateCartItemQuantity(item.cart_item_id, maxStock);
        requiresDbUpdate = true;
      }

      // Price comparison (informational, we don't snapshot price in DB anyway)
      const currentPrice = item.variant_id ? item.dynamic_variant_price : item.dynamic_product_price;
      
      validatedItems.push({
        id: item.cart_item_id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: finalQuantity,
        name: item.product_snapshot_name,
        sku: item.product_snapshot_sku,
        slug: item.product_slug,
        selected_variant_name: item.selected_variant_name,
        selected_variant_values: item.selected_variant_values,
        metadata: item.metadata,
        price: currentPrice,
        compare_at_price: item.dynamic_product_compare,
        available_stock: maxStock
      });
    }

    if (requiresDbUpdate) {
      await CartRepository.touchCart(cart.id);
    }

    // Phase 13.6 Pricing Engine Integration
    // For now we don't persist cart.coupon_code in DB, so we rely on what's passed (or null).
    // The storefront will pass couponCode in a separate checkout API.
    // We will just calculate auto-promotions for getCart by default unless a coupon is passed.
    
    let pricingBreakdown = null;
    let pricingError = null;
    
    try {
      pricingBreakdown = await PricingEngineService.calculateDiscounts(validatedItems, cartToken === 'COUPON_TEST' ? null : null);
    } catch (e) {
      pricingError = e.message;
    }

    return { 
      cart_id: cart.id,
      cart_token: cart.cart_token,
      currency: cart.currency,
      items: validatedItems, 
      pricing: pricingBreakdown,
      meta: { warnings, pricing_error: pricingError } 
    };
  }

  async addItem(userId, cartToken, { product_id, variant_id, quantity, metadata }) {
    if (quantity <= 0) throw new Error("Quantity must be greater than zero");

    // Fetch full product details
    const product = await ProductRepository.findById(product_id);
    if (!product || product.status !== 'PUBLISHED') {
      throw new Error("Product is unavailable");
    }

    // Determine variant & check stock
    let targetVariant = null;
    let availableStock = 0;
    
    // We need to fetch stock. We can reuse ProductRepository.findBySlugOrSku to get full graph.
    const fullProduct = await ProductRepository.findBySlugOrSku(product.slug);
    
    if (variant_id) {
      targetVariant = fullProduct.variants?.find(v => v.id === parseInt(variant_id));
      if (!targetVariant) throw new Error("Invalid variant");
      availableStock = targetVariant.available_stock;
    } else {
      // Simplified for products without variants
      // In a real app, you'd fetch the base product inventory
      // We assume fullProduct.variants has the default if single
      targetVariant = fullProduct.variants?.[0];
      availableStock = targetVariant?.available_stock || 100; // fallback for now
      variant_id = targetVariant?.id || null;
    }

    if (quantity > availableStock) {
      throw new Error(`Only ${availableStock} units available`);
    }

    // Get or Create Cart
    let cart = await CartRepository.getActiveCart(userId, cartToken);
    let cartId;
    let newCartToken = cartToken;

    if (!cart) {
      if (!userId && !cartToken) {
        const crypto = require('crypto');
        newCartToken = crypto.randomUUID();
      }
      cartId = await CartRepository.createCart(userId, newCartToken);
    } else {
      cartId = cart.id;
    }

    // Check if item already exists
    const existingItem = await CartRepository.findCartItem(cartId, product_id, variant_id);
    
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > availableStock) {
        throw new Error(`Cannot add ${quantity} more. Only ${availableStock} units total available`);
      }
      await CartRepository.updateCartItemQuantity(existingItem.id, newQty);
    } else {
      await CartRepository.addCartItem(cartId, {
        product_id,
        variant_id,
        quantity,
        product_snapshot_name: product.name,
        product_snapshot_sku: targetVariant ? targetVariant.sku : product.sku,
        selected_variant_name: targetVariant ? (targetVariant.name || targetVariant.sku) : null,
        selected_variant_values: targetVariant ? targetVariant.attributes : null,
        metadata
      });
    }

    return await this.getCart(userId, newCartToken);
  }

  async updateItemQuantity(userId, cartToken, cartItemId, quantity) {
    if (quantity <= 0) throw new Error("Quantity must be greater than zero");
    
    const cart = await CartRepository.getActiveCart(userId, cartToken);
    if (!cart) throw new Error("Cart not found");

    // We rely on getCart to handle stock validations & warnings if over limit,
    // but we can also just update it blindly and let getCart correct it.
    // For safer UX, let's do a quick validation via getCartItems
    const items = await CartRepository.getCartItems(cart.id);
    const item = items.find(i => i.cart_item_id === parseInt(cartItemId));
    
    if (!item) throw new Error("Item not found in cart");
    if (quantity > item.available_stock) {
      throw new Error(`Only ${item.available_stock} units available`);
    }

    await CartRepository.updateCartItemQuantity(cartItemId, quantity);
    return await this.getCart(userId, cartToken);
  }

  async removeItem(userId, cartToken, cartItemId) {
    const cart = await CartRepository.getActiveCart(userId, cartToken);
    if (!cart) return null;
    await CartRepository.removeCartItem(cartItemId);
    return await this.getCart(userId, cartToken);
  }

  async clearCart(userId, cartToken) {
    const cart = await CartRepository.getActiveCart(userId, cartToken);
    if (!cart) return null;
    await CartRepository.clearCartItems(cart.id);
    return await this.getCart(userId, cartToken);
  }

  async mergeGuestCart(guestCartToken, userId) {
    if (!guestCartToken || !userId) throw new Error("Missing credentials for merge");
    await CartRepository.mergeGuestCart(guestCartToken, userId);
    return await this.getCart(userId, null);
  }

}

module.exports = new CartService();
