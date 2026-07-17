import React from 'react';
import { HeroCarousel } from '../components/home/HeroCarousel/HeroCarousel';
import { FeaturedCategories } from '../components/home/FeaturedCategories/FeaturedCategories';
import { ProductSection } from '../components/home/ProductSection/ProductSection';
import { TrustBadges } from '../components/home/TrustBadges/TrustBadges';
import { Newsletter } from '../components/home/Newsletter/Newsletter';
import { ErrorState } from '../components/ui/ErrorState/ErrorState';

export const revalidate = 60; // Next.js ISR

async function getHomeData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/store/home`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch home data');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Home Page Fetch Error:", error);
    return null;
  }
}

export default async function Home() {
  const data = await getHomeData();

  if (!data) {
    return (
      <main className="container" style={{ padding: '40px 0' }}>
        <ErrorState 
          title="Storefront Offline" 
          message="We are currently experiencing issues connecting to the catalog. Please check back later."
        />
      </main>
    );
  }

  const { heroBanner, featuredCategories, featuredProducts, newArrivals } = data;

  return (
    <main>
      <HeroCarousel banner={heroBanner} />
      
      <TrustBadges />

      <FeaturedCategories categories={featuredCategories} />

      <ProductSection 
        title="Trending Now" 
        subtitle="The most sought-after toys right now."
        products={featuredProducts} 
        actionText="View All"
        actionHref="/shop?sort=trending"
      />

      <ProductSection 
        title="New Arrivals" 
        subtitle="Fresh additions to our collection."
        products={newArrivals} 
        actionText="View All"
        actionHref="/new-arrivals"
      />

      <Newsletter />
    </main>
  );
}
