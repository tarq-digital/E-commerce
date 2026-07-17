"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './HeroCarousel.module.css';
import { Button } from '../../ui/Button/Button';
import { cn } from '../../../utils/cn';

import { getBannerImage } from '../../../utils/image';

export const HeroCarousel = ({ banner }) => {
  // Driven entirely by props
  const slides = [
    {
      id: 1,
      image: getBannerImage(banner?.image),
      title: banner?.title || "Discover Premium Anime Statues",
      subtitle: banner?.subtitle || "Exclusive pre-orders now available.",
      cta_text: banner?.cta_text || "Shop Now",
      cta_link: banner?.cta_link || "/shop"
    }
  ];

  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollNext = () => {
    if (sliderRef.current) {
      const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
      sliderRef.current.scrollTo({
        left: nextIndex * sliderRef.current.clientWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(nextIndex);
    }
  };

  const scrollPrev = () => {
    if (sliderRef.current) {
      const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      sliderRef.current.scrollTo({
        left: prevIndex * sliderRef.current.clientWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(prevIndex);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const index = Math.round(sliderRef.current.scrollLeft / sliderRef.current.clientWidth);
        setCurrentIndex(index);
      }
    };
    const ref = sliderRef.current;
    ref?.addEventListener('scroll', handleScroll, { passive: true });
    return () => ref?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <div className={cn(styles.slider, "no-scrollbar")} ref={sliderRef}>
        {slides.map((slide, index) => (
          <div key={slide.id} className={styles.slide}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className={styles.image}
              sizes="100vw"
            />
            <div className={styles.overlay}>
              <div className={cn("container", styles.content)}>
                <h1 className={styles.title}>{slide.title}</h1>
                <p className={styles.subtitle}>{slide.subtitle}</p>
                <Link href={slide.cta_link}>
                  <Button size="lg" variant="primary">{slide.cta_text}</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {slides.length > 1 && (
        <>
          <button className={cn(styles.navBtn, styles.prevBtn)} onClick={scrollPrev}>
            <ChevronLeft size={24} />
          </button>
          <button className={cn(styles.navBtn, styles.nextBtn)} onClick={scrollNext}>
            <ChevronRight size={24} />
          </button>
          
          <div className={styles.dots}>
            {slides.map((_, idx) => (
              <button 
                key={idx} 
                className={cn(styles.dot, currentIndex === idx && styles.activeDot)}
                onClick={() => {
                  sliderRef.current?.scrollTo({
                    left: idx * sliderRef.current.clientWidth,
                    behavior: 'smooth'
                  });
                  setCurrentIndex(idx);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
