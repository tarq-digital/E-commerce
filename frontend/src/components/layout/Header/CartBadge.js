"use client";

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartState, useCartDispatch } from '../../../context/CartContext';
import styles from './Header.module.css'; // We'll reuse iconButton styles

export const CartBadge = () => {
  const { items } = useCartState();
  const { toggleDrawer } = useCartDispatch();

  // Sum up all item quantities (or you can just count unique items: items.length)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button 
      className={styles.iconButton} 
      onClick={() => toggleDrawer(true)}
      aria-label="Open Cart"
    >
      <ShoppingBag size={24} />
      {totalItems > 0 && (
        <span className={styles.cartBadge}>
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};
