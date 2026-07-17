import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import styles from './categories.module.css';
import { getBannerImage, getCategoryImage } from '../../../utils/image';

async function getCategories() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/store/categories`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className={styles.pageWrapper}>
      {/* Banner */}
      <div className={styles.banner}>
        <Image 
          src={getBannerImage(null)} 
          alt="Categories Banner" 
          fill 
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <div className="container">
            <h1 className={styles.bannerTitle}>Our Categories</h1>
            <p className={styles.bannerSubtitle}>Explore our massive collection by universe</p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <span>Categories</span>
        </nav>

        {/* Categories Grid */}
        <div className={styles.grid}>
          {categories.map((cat) => {
            const image = getCategoryImage(cat.image);

            return (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image src={image} alt={cat.name} fill className={styles.image} sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className={styles.overlay} />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.name}>{cat.name}</h3>
                  <p className={styles.description}>{cat.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
