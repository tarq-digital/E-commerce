import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader } from '../../ui/SectionHeader/SectionHeader';
import styles from './FeaturedCategories.module.css';
import { cn } from '../../../utils/cn';
import { getCategoryImage } from '../../../utils/image';

export const FeaturedCategories = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className={cn("container", styles.section)}>
      <SectionHeader 
        title="Shop by Category" 
        subtitle="Explore our premium collection by your favorite categories."
        actionText="View All"
        actionHref="/categories"
      />
      
      <div className={styles.grid}>
        {categories.map((cat) => {
          const image = getCategoryImage(cat.image);

          return (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={image} 
                  alt={cat.name} 
                  fill 
                  className={styles.image} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className={styles.overlay} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{cat.name}</h3>
                <span className={styles.shopNow}>Shop Now</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
