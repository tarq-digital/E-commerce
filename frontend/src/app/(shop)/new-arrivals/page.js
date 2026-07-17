import React from 'react';
import styles from '../../page.module.css'; 

export default function NewArrivalsPage() {
  return (
    <div className={`container ${styles.main}`}>
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>New Arrivals</h1>
        <div className={styles.emptyState} style={{ padding: '4rem', textAlign: 'center', background: 'hsl(var(--secondary))', borderRadius: '12px' }}>
          <p>Discover the latest premium toys.</p>
        </div>
      </section>
    </div>
  );
}
