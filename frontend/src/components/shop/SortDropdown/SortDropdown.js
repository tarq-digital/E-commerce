"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './SortDropdown.module.css';
import { ChevronDown } from 'lucide-react';

export const SortDropdown = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>Sort by:</span>
      <div className={styles.selectWrapper}>
        <select 
          className={styles.select} 
          value={currentSort} 
          onChange={handleSortChange}
        >
          <option value="newest">New Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="trending">Trending Now</option>
        </select>
        <ChevronDown size={16} className={styles.icon} />
      </div>
    </div>
  );
};
