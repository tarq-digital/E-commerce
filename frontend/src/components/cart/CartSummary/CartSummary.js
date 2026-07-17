"use client";

import React from 'react';
import { useCartState, useCartDispatch } from '../../../context/CartContext';
import { Button } from '../../ui/Button/Button';
import styles from './CartSummary.module.css';

export const CartSummary = () => {
  const { subtotal, status } = useCartState();
  const { toggleDrawer } = useCartDispatch();

  // In a real app you might have a dedicated checkout flow.
  // For now we just route or mock.
  const handleCheckout = () => {
    alert("Proceeding to Checkout... (Phase 12)");
    toggleDrawer(false);
  };

  return (
    <div className={styles.summary}>
      <div className={styles.row}>
        <span>Subtotal</span>
        <span>${parseFloat(subtotal).toFixed(2)}</span>
      </div>
      
      <div className={styles.row}>
        <span>Shipping & Taxes</span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Calculated at checkout</span>
      </div>

      <div className={`${styles.row} ${styles.total}`}>
        <span>Estimated Total</span>
        <span>${parseFloat(subtotal).toFixed(2)}</span>
      </div>

      <Button 
        variant="primary" 
        size="lg" 
        fullWidth 
        onClick={handleCheckout}
        disabled={status.isSyncing || status.isLoading}
      >
        Proceed to Checkout
      </Button>
      
      <p className={styles.subtext}>
        Secure checkout powered by Stripe
      </p>
    </div>
  );
};
