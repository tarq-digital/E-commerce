"use client";

import React from 'react';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { useCartDispatch, useCartState } from '../../../context/CartContext';
import styles from './CartItem.module.css';

export const CartItem = React.memo(({ item }) => {
  const { updateQuantity, removeFromCart } = useCartDispatch();
  const { status } = useCartState();
  const isUpdating = status.updatingItemId === item.id;
  const isRemoving = status.removingItemId === item.id;
  const isDisabled = isUpdating || isRemoving;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.available_stock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  return (
    <div className={styles.cartItem} style={{ opacity: isRemoving ? 0.5 : 1 }}>
      <div className={styles.imageWrapper}>
        {/* Placeholder image since we don't fetch cart images actively yet, in a real app this comes from snapshot */}
        <Image 
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload/v1/placeholder`}
          alt={item.name}
          fill
          sizes="80px"
          className={styles.image}
        />
      </div>

      <div className={styles.details}>
        <div className={styles.headerRow}>
          <h4 className={styles.name}>{item.name}</h4>
          <span className={styles.price}>${parseFloat(item.price).toFixed(2)}</span>
        </div>
        
        {item.selected_variant_name && (
          <p className={styles.variant}>{item.selected_variant_name}</p>
        )}

        <div className={styles.actionsRow}>
          <div className={styles.quantityControl}>
            <button 
              className={styles.qtyBtn} 
              onClick={handleDecrease}
              disabled={item.quantity <= 1 || isDisabled}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className={styles.qtyValue}>{item.quantity}</span>
            <button 
              className={styles.qtyBtn} 
              onClick={handleIncrease}
              disabled={item.quantity >= item.available_stock || isDisabled}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          
          <button 
            className={styles.removeBtn}
            onClick={() => removeFromCart(item.id)}
            disabled={isDisabled}
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </button>
        </div>

        {item.quantity >= item.available_stock && (
          <span className={styles.stockWarning}>Max available quantity reached</span>
        )}
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';
