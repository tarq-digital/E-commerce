"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import styles from './StickyAddToCart.module.css';
import { Button } from '../../ui/Button/Button';

export const StickyAddToCart = ({ productName, price, isOutOfStock }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolling past 400px (approx past the main add to cart button)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.container}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className={`container ${styles.content}`}>
            <div className={styles.info}>
              <h4 className={styles.name}>{productName}</h4>
              <span className={styles.price}>${parseFloat(price).toFixed(2)}</span>
            </div>
            <div className={styles.action}>
              <Button 
                variant="primary" 
                size="md" 
                disabled={isOutOfStock}
                leftIcon={<ShoppingBag size={18} />}
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
