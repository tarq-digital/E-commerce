import React from 'react';
import styles from './shop.module.css';
import { ProductCard } from '../../../components/product/ProductCard/ProductCard';
import { FilterSidebar } from '../../../components/shop/FilterSidebar/FilterSidebar';
import { SortDropdown } from '../../../components/shop/SortDropdown/SortDropdown';
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState/ErrorState';

async function getProducts(searchParams) {
  const query = new URLSearchParams(searchParams).toString();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/store/products?${query}`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Shop Page Fetch Error:", error);
    return null;
  }
}

export default async function ShopPage({ searchParams }) {
  const productsData = await getProducts(searchParams);
  
  if (!productsData) {
    return (
      <main className="container" style={{ padding: '40px 0' }}>
        <ErrorState 
          title="Unable to load catalog" 
          message="We are having trouble connecting to our database. Please try again later."
        />
      </main>
    );
  }

  const products = productsData.data || [];
  const meta = productsData.meta || {};

  return (
    <div className={`container ${styles.shopContainer}`}>
      <FilterSidebar />
      
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Shop Collection</h1>
            <p className={styles.resultsCount}>Showing {products.length} results</p>
          </div>
          <div className={styles.controls}>
            <SortDropdown />
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyState 
            title="No products found" 
            description="Try adjusting your filters or search criteria."
            actionText="Clear Filters"
            actionHref="/shop"
          />
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className={styles.pagination}>
            {/* Minimal pagination UI for demo */}
            <span className={styles.pageInfo}>Page {meta.page} of {meta.totalPages}</span>
          </div>
        )}
      </div>
    </div>
  );
}
