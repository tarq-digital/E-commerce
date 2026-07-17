"use client";

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader } from '../../ui/SectionHeader/SectionHeader';
import { ProductCard } from '../../product/ProductCard/ProductCard';
import styles from './ProductSection.module.css';
import { cn } from '../../../utils/cn';

export const ProductSection = ({ title, subtitle, products, actionText, actionHref }) => {
  const scrollRef = useRef(null);

  if (!products || products.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className={cn("container", styles.section)}>
      <div className={styles.headerRow}>
        <SectionHeader 
          title={title} 
          subtitle={subtitle}
          actionText={actionText}
          actionHref={actionHref}
          className={styles.header}
        />
        <div className={styles.navButtons}>
          <button className={styles.navBtn} onClick={() => scroll('left')} aria-label="Scroll left">
            <ChevronLeft size={24} />
          </button>
          <button className={styles.navBtn} onClick={() => scroll('right')} aria-label="Scroll right">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      <div className={cn(styles.scrollContainer, "no-scrollbar")} ref={scrollRef}>
        {products.map(product => (
          <div key={product.id} className={styles.cardWrapper}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
