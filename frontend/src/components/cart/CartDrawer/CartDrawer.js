"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCartState, useCartDispatch } from '../../../context/CartContext';
import { CartItem } from '../CartItem/CartItem';
import { CartSummary } from '../CartSummary/CartSummary';
import { Button } from '../../ui/Button/Button';
import styles from './CartDrawer.module.css';

export const CartDrawer = () => {
  const { isDrawerOpen, items, status } = useCartState();
  const { toggleDrawer } = useCartDispatch();
  const drawerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Focus trapping & ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) toggleDrawer(false);
    };
    
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'; // prevent background scrolling
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, toggleDrawer]);

  const isEmpty = items.length === 0;

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleDrawer(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Your Cart ({items.length})</h2>
              <button 
                className={styles.closeBtn} 
                onClick={() => toggleDrawer(false)}
                aria-label="Close cart drawer"
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.content}>
              {status.isLoading ? (
                <div className={styles.emptyState}>Loading cart...</div>
              ) : isEmpty ? (
                <div className={styles.emptyState}>
                  <ShoppingBag size={48} className={styles.emptyIcon} />
                  <h3>Your cart is empty</h3>
                  <p>Looks like you haven't added anything yet.</p>
                  <Button variant="primary" onClick={() => toggleDrawer(false)}>Continue Shopping</Button>
                </div>
              ) : (
                items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))
              )}
            </div>

            {!isEmpty && (
              <div className={styles.footer}>
                <CartSummary />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
