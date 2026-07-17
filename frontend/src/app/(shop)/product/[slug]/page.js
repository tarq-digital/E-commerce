import React from 'react';
import { Heart, ShoppingBag, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import styles from './product.module.css';
import { ProductGallery } from '../../../components/product/ProductGallery/ProductGallery';
import { VariantSelector } from '../../../components/product/VariantSelector/VariantSelector';
import { StickyAddToCart } from '../../../components/product/StickyAddToCart/StickyAddToCart';
import { Button } from '../../../components/ui/Button/Button';
import { ErrorState } from '../../../components/ui/ErrorState/ErrorState';
import { getProductImage } from '../../../utils/image';

async function getProductDetails(slug) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/store/products/${slug}`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('Failed to fetch product');
    const json = await res.json();
    return json.data.product;
  } catch (error) {
    console.error("PDP Fetch Error:", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const product = await getProductDetails(params.slug);

  if (!product) {
    return (
      <main className="container" style={{ padding: '40px 0' }}>
        <ErrorState 
          title="Product Not Found" 
          message="The product you are looking for does not exist or has been removed."
          onRetry={() => {}} // Could be a router back
        />
      </main>
    );
  }

  const { name, description, price, compare_at_price, image, images, stock_status } = product;
  const hasDiscount = compare_at_price && compare_at_price > price;
  const discountPercent = hasDiscount ? Math.round(((compare_at_price - price) / compare_at_price) * 100) : 0;
  const isOutOfStock = stock_status === 'OUT_OF_STOCK';
  
  // Map all images through our utility
  const galleryImages = images && images.length > 0 
    ? images.map(img => getProductImage(img)) 
    : [getProductImage(image)];

  // Dummy variants for showcase
  const variants = [
    { id: 'v1', sku: 'Standard Edition', price: price },
    { id: 'v2', sku: 'Collector Edition', price: price * 1.5 }
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={`container ${styles.container}`}>
        
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop">Shop</Link>
          <ChevronRight size={14} />
          <span>{name}</span>
        </nav>
        
        <div className={styles.productLayout}>
          {/* Image Gallery */}
          <div className={styles.gallerySection}>
            <ProductGallery 
              images={galleryImages} 
              productName={name} 
              hasDiscount={hasDiscount} 
              discountPercent={discountPercent} 
            />
          </div>

          {/* Product Info */}
          <div className={styles.infoSection}>
            <h1 className={styles.title}>{name}</h1>
            
            <div className={styles.priceBlock}>
              <span className={styles.price}>${parseFloat(price).toFixed(2)}</span>
              {hasDiscount && (
                <span className={styles.comparePrice}>${parseFloat(compare_at_price).toFixed(2)}</span>
              )}
            </div>

            <VariantSelector variants={variants} />

            <div className={styles.actions}>
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth
                disabled={isOutOfStock}
                leftIcon={<ShoppingBag size={20} />}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className={styles.wishlistBtn}
                aria-label="Add to Wishlist"
              >
                <Heart size={24} />
              </Button>
            </div>

            <div className={styles.trustBadges}>
              <div className={styles.trustBadge}>
                <Truck size={20} className={styles.trustIcon} />
                <div className={styles.trustText}>
                  <strong>Free Shipping</strong>
                  <span>On orders over $100</span>
                </div>
              </div>
              <div className={styles.trustBadge}>
                <ShieldCheck size={20} className={styles.trustIcon} />
                <div className={styles.trustText}>
                  <strong>Authentic Guarantee</strong>
                  <span>100% genuine licensed products</span>
                </div>
              </div>
            </div>

            <div className={styles.descriptionBlock}>
              <h3 className={styles.descriptionTitle}>Product Details</h3>
              <div className={styles.description}>
                <p>{description || 'Premium collectible figure featuring exceptional detail and articulation. Hand-painted with meticulous care to bring your favorite character to life.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Add to Cart (Only appears when scrolling past main button) */}
      <StickyAddToCart 
        productName={name}
        price={price}
        isOutOfStock={isOutOfStock}
      />
    </div>
  );
}
