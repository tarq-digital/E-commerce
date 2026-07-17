"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import styles from './ProductGallery.module.css';
import { cn } from '../../../utils/cn';
import { ImageZoom } from './ImageZoom';
import { getProductImage } from '../../../utils/image';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  })
};

export const ProductGallery = ({ images, productName, hasDiscount, discountPercent }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fallback to placeholder if no images exist
  const galleryImages = images && images.length > 0 
    ? images 
    : [getProductImage(null)];

  const imageIndex = Math.abs(page % galleryImages.length);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className={cn(styles.galleryContainer, isFullscreen && styles.fullscreen)}>
      
      {/* Main Image View */}
      <div className={styles.mainView}>
        {hasDiscount && !isFullscreen && (
          <span className={styles.discountBadge}>-{discountPercent}%</span>
        )}

        <button 
           className={styles.fullscreenBtn} 
           onClick={() => setIsFullscreen(!isFullscreen)}
           aria-label={isFullscreen ? "Close Fullscreen" : "Toggle Fullscreen"}
        >
          <Maximize2 size={20} />
        </button>

        <div className={styles.slider}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -10000) {
                  paginate(1);
                } else if (swipe > 10000) {
                  paginate(-1);
                }
              }}
              className={styles.slide}
            >
              <ImageZoom 
                src={galleryImages[imageIndex]} 
                alt={`${productName} image ${imageIndex + 1}`} 
                priority={true} 
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {galleryImages.length > 1 && (
          <>
            <button className={cn(styles.navBtn, styles.navPrev)} onClick={() => paginate(-1)}>
              <ChevronLeft size={24} />
            </button>
            <button className={cn(styles.navBtn, styles.navNext)} onClick={() => paginate(1)}>
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Strip */}
      {galleryImages.length > 1 && (
        <div className={styles.thumbnails}>
          {galleryImages.map((src, idx) => (
            <button
              key={idx}
              className={cn(styles.thumbnailWrapper, imageIndex === idx && styles.activeThumbnail)}
              onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
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
