"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';
import { cn } from '../../../utils/cn';
import { getProductImage } from '../../../utils/image';

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { name, slug, price, compare_at_price, image, stock_status } = product;

  const imageUrl = getProductImage(image);
  const hasDiscount = compare_at_price && compare_at_price > price;
  const discountPercent = hasDiscount ? Math.round(((compare_at_price - price) / compare_at_price) * 100) : 0;
  const isOutOfStock = stock_status === 'OUT_OF_STOCK';

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    // Add to cart logic here
  };

  return (
    <motion.div 
      className={styles.card}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.imageContainer}>
        {hasDiscount && <span className={styles.discountBadge}>-{discountPercent}%</span>}
        {isOutOfStock && <span className={styles.outOfStockBadge}>Sold Out</span>}
        
        <Link href={`/product/${slug}`} className={styles.imageLink}>
          <Image 
            src={imageUrl}
            alt={name}
            fill
            className={cn(styles.image, isHovered && styles.imageHover)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>
        
        <button 
          className={cn(styles.wishlistBtn, isWishlisted && styles.wishlisted)} 
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        
        <div className={cn(styles.actionsOverlay, isHovered && styles.actionsVisible)}>
          <button className={styles.actionBtn} onClick={handleQuickAdd} disabled={isOutOfStock}>
            <ShoppingBag size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.titleRow}>
          <Link href={`/product/${slug}`} className={styles.nameLink}>
            <h3 className={styles.name}>{name}</h3>
          </Link>
        </div>
        <div className={styles.priceContainer}>
          <span className={styles.price}>${parseFloat(price).toFixed(2)}</span>
          {hasDiscount && (
            <span className={styles.comparePrice}>${parseFloat(compare_at_price).toFixed(2)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
