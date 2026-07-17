"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ProductGallery.module.css';
import { cn } from '../../../utils/cn';
import { getProductImage } from '../../../utils/image';

export const ProductGallery = ({ images, productName, hasDiscount, discountPercent }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  // If there are no images, provide a placeholder
  const galleryImages = images && images.length > 0 
    ? images 
    : [getProductImage(null)];

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
        setCurrentIndex(index);
      }
    };
    const ref = scrollRef.current;
    ref?.addEventListener('scroll', handleScroll, { passive: true });
    return () => ref?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.galleryContainer}>
      {/* Main Swipeable Area */}
      <div className={styles.mainView}>
        {hasDiscount && (
          <span className={styles.discountBadge}>-{discountPercent}%</span>
        )}
        
        <div className={cn(styles.slider, "no-scrollbar")} ref={scrollRef}>
          {galleryImages.map((src, idx) => (
            <div key={idx} className={styles.slide}>
              <Image 
                src={src}
                alt={`${productName} image ${idx + 1}`}
                fill
                priority={idx === 0}
                className={styles.mainImage}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        {/* Mobile dots indicator */}
        <div className={styles.dots}>
          {galleryImages.map((_, idx) => (
            <button 
              key={idx}
              className={cn(styles.dot, currentIndex === idx && styles.activeDot)}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Thumbnails */}
      {galleryImages.length > 1 && (
        <div className={styles.thumbnails}>
          {galleryImages.map((src, idx) => (
            <button 
              key={idx}
              className={cn(styles.thumbnailWrapper, currentIndex === idx && styles.activeThumbnail)}
              onClick={() => scrollToIndex(idx)}
            >
              <Image 
                src={src}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className={styles.thumbnailImage}
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
