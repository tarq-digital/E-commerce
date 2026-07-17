"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './ImageZoom.module.css';
import { cn } from '../../../utils/cn';

export const ImageZoom = ({ src, alt, priority = false }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      className={styles.zoomContainer}
      ref={containerRef}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <div 
        className={cn(styles.zoomImageWrapper, isZoomed && styles.zoomed)}
        style={{
          transformOrigin: `${position.x}% ${position.y}%`
        }}
      >
        <Image 
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={styles.image}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
};
