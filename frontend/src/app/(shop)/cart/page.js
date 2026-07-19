'use client';

import React from 'react';
import Link from 'next/link';
import { useCartState } from '../../../context/CartContext';
import { CartItem } from '../../../components/cart/CartItem/CartItem';
import { CartSummary } from '../../../components/cart/CartSummary/CartSummary';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import styles from '../../page.module.css'; 

export default function CartPage() {
  const { items, status } = useCartState();
  
  const isEmpty = items?.length === 0;

  if (status.isLoading) {
    return (
      <div className={`container ${styles.main}`}>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>Your Cart</h1>
          <div className="p-8 text-center">Loading cart...</div>
        </section>
      </div>
    );
  }

  return (
    <div className={`container ${styles.main}`}>
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Your Cart</h1>
        
        {isEmpty ? (
          <div className={styles.emptyState} style={{ padding: '4rem', textAlign: 'center', background: 'hsl(var(--secondary))', borderRadius: '12px' }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ marginBottom: '1.5rem' }}>Your cart is currently empty. Start shopping!</p>
            <Link href="/shop">
              <Button variant="primary">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div style={{ position: 'sticky', top: '2rem' }}>
              <CartSummary />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
