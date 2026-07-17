"use client";

import React, { useEffect, useState } from 'react';
import { ProductSection } from '../../home/ProductSection/ProductSection';

export const RecentlyViewed = ({ currentProduct }) => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    if (!currentProduct) return;
    
    try {
      // 1. Get existing from localStorage
      const stored = localStorage.getItem('recentlyViewed');
      let history = stored ? JSON.parse(stored) : [];
      
      // 2. Remove current if exists (so we can move it to front)
      history = history.filter(p => p.id !== currentProduct.id);
      
      // 3. Keep a slim version of the product to save storage space
      const slimProduct = {
        id: currentProduct.id,
        name: currentProduct.name,
        slug: currentProduct.slug,
        price: currentProduct.price,
        compare_at_price: currentProduct.compare_at_price,
        image: currentProduct.image,
        category_id: currentProduct.category?.id
      };
      
      // 4. Add to front
      history.unshift(slimProduct);
      
      // 5. Limit to 10
      if (history.length > 10) history.pop();
      
      // 6. Save
      localStorage.setItem('recentlyViewed', JSON.stringify(history));
      
      // 7. Update state (excluding current product from display)
      setRecentProducts(history.filter(p => p.id !== currentProduct.id).slice(0, 5));
    } catch (error) {
      console.error("Failed to manage recently viewed:", error);
    }
  }, [currentProduct]);

  if (recentProducts.length === 0) return null;

  return (
    <ProductSection 
      title="Recently Viewed"
      products={recentProducts}
    />
  );
};
