import React from 'react';
import styles from '../../page.module.css'; 

export default function CartPage() {
  return (
    <div className={`container ${styles.main}`}>
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Your Cart</h1>
        <div className={styles.emptyState} style={{ padding: '4rem', textAlign: 'center', background: 'hsl(var(--secondary))', borderRadius: '12px' }}>
          <p>Your cart is currently empty. Start shopping!</p>
        </div>
      </section>
    </div>
  );
}
