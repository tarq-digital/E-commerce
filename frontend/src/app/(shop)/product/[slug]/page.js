import React from 'react';
import { Heart, ShoppingBag, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import styles from './product.module.css';
import { ProductGallery } from '../../../../components/product/ProductGallery/ProductGallery';
import { ProductInteractive } from '../../../../components/product/ProductInteractive/ProductInteractive';
import { ProductTabs } from '../../../../components/product/ProductTabs/ProductTabs';
import { RecentlyViewed } from '../../../../components/product/RecentlyViewed/RecentlyViewed';
import { ProductSection } from '../../../../components/home/ProductSection/ProductSection';
import { ErrorState } from '../../../../components/ui/ErrorState/ErrorState';
import { getProductImage } from '../../../../utils/image';

async function getProductDetails(slug) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
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

export async function generateMetadata({ params }) {
  const product = await getProductDetails(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found | Weebster',
    };
  }

  const images = product.image?.secure_url ? [product.image.secure_url] : [];
  const title = product.seo_title || `${product.name} | Weebster`;
  const description = product.seo_description || product.short_description || product.description?.substring(0, 160) || 'Premium anime figure and merchandise.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    }
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductDetails(params.slug);

  if (!product) {
    return (
      <main className="container" style={{ padding: '40px 0' }}>
        <ErrorState 
          title="Product Not Found" 
          message="The product you are looking for does not exist or has been removed."
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
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`}>{product.category.name}</Link>
              <ChevronRight size={14} />
            </>
          )}
          <span>{name}</span>
        </nav>
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": name,
              "image": galleryImages,
              "description": description,
              "sku": product.sku,
              "brand": {
                "@type": "Brand",
                "name": product.brand?.name || "Weebster"
              },
              "offers": {
                "@type": "Offer",
                "url": `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/product/${product.slug}`,
                "priceCurrency": "USD",
                "price": price,
                "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
              }
            })
          }}
        />
        
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
            
            <ProductInteractive product={product} />

          </div>
        </div>

        {/* Tabs Section (Description, Specs, Reviews, Shipping) */}
        <ProductTabs product={product} />

      </div>

      <div style={{ padding: '0', marginTop: '60px' }}>
        {/* Related Products */}
        {product.related_products && product.related_products.length > 0 && (
          <ProductSection 
            title="You May Also Like"
            products={product.related_products}
          />
        )}

        {/* Recently Viewed */}
        <RecentlyViewed currentProduct={product} />
      </div>
    </div>
  );
}
