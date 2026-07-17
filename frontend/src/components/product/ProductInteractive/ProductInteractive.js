"use client";

import React, { useState, useMemo } from 'react';
import { Heart, ShoppingBag, Truck, ShieldCheck, Minus, Plus } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import { VariantSelector } from '../VariantSelector/VariantSelector';
import { StickyAddToCart } from '../StickyAddToCart/StickyAddToCart';
import { useCartDispatch, useCartState } from '../../../context/CartContext';
import styles from './ProductInteractive.module.css';

export const ProductInteractive = ({ product }) => {
  const { variants = [], base_price, compare_at_price } = product;

  // State
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const [quantity, setQuantity] = useState(1);

  // Cart Context
  const { addToCart } = useCartDispatch();
  const { status } = useCartState();
  const isAdding = status.isAdding;

  // Derived values
  const activePrice = selectedVariant ? selectedVariant.price : base_price;
  const activeCompareAt = compare_at_price; 
  const hasDiscount = activeCompareAt && activeCompareAt > activePrice;
  const stock = selectedVariant ? selectedVariant.available_stock : 0;
  const isOutOfStock = stock <= 0;

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > stock) return stock; // Prevent exceeding stock
      return next;
    });
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity on variant change
  };

  return (
    <div className={styles.interactiveContainer}>
      
      {/* Price */}
      <div className={styles.priceBlock}>
        <span className={styles.price}>${parseFloat(activePrice).toFixed(2)}</span>
        {hasDiscount && (
          <span className={styles.comparePrice}>${parseFloat(activeCompareAt).toFixed(2)}</span>
        )}
      </div>

      {/* Stock Indicator */}
      <div className={styles.stockIndicator}>
        {isOutOfStock ? (
          <span className={styles.outOfStock}>Out of Stock</span>
        ) : stock <= 5 ? (
          <span className={styles.lowStock}>Only {stock} left in stock - order soon.</span>
        ) : (
          <span className={styles.inStock}>In Stock</span>
        )}
      </div>

      {/* Variant Selector */}
      {variants.length > 1 && (
        <VariantSelector 
          variants={variants} 
          selectedVariant={selectedVariant}
          onSelect={handleVariantSelect}
        />
      )}

      {/* Purchase Section */}
      <div className={styles.purchaseSection}>
        <div className={styles.quantityWrapper}>
          <button 
            className={styles.qtyBtn} 
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || isOutOfStock}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <input 
            type="number" 
            className={styles.qtyInput} 
            value={quantity}
            readOnly
            aria-label="Quantity"
          />
          <button 
            className={styles.qtyBtn} 
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= stock || isOutOfStock}
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className={styles.actions}>
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth
            disabled={isOutOfStock || isAdding}
            leftIcon={<ShoppingBag size={20} />}
            onClick={() => addToCart(product, selectedVariant, quantity)}
          >
            {isOutOfStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className={styles.wishlistBtn}
            aria-label="Add to Wishlist"
          >
            <Heart size={24} />
          </Button>
        </div>
        
        {/* Buy Now */}
        <Button 
          variant="secondary" 
          size="lg" 
          fullWidth
          disabled={isOutOfStock}
          className={styles.buyNowBtn}
        >
          Buy It Now
        </Button>
      </div>

      {/* Trust Badges */}
      <div className={styles.trustBadges}>
        <div className={styles.trustBadge}>
          <Truck size={20} className={styles.trustIcon} />
          <div className={styles.trustText}>
            <strong>Free Shipping</strong>
            <span>On orders over $100</span>
          </div>
        </div>
        <div className={styles.trustBadge}>
          <ShieldCheck size={20} className={styles.trustIcon} />
          <div className={styles.trustText}>
            <strong>Authentic Guarantee</strong>
            <span>100% genuine licensed products</span>
          </div>
        </div>
      </div>

      <StickyAddToCart 
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        isOutOfStock={isOutOfStock}
        isAdding={isAdding}
      />

    </div>
  );
};
