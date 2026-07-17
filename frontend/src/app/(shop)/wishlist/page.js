import React from 'react';
import styles from '../../page.module.css'; 

export default function WishlistPage() {
  return (
    <div className={`container ${styles.main}`}>
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Your Wishlist</h1>
        <div className={styles.emptyState} style={{ padding: '4rem', textAlign: 'center', background: 'hsl(var(--secondary))', borderRadius: '12px' }}>
          <p>You haven't saved any items yet.</p>
        </div>
      </section>
    </div>
  );
}
