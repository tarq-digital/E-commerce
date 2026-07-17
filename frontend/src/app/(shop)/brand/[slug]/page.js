import React from 'react';
import styles from '../../../page.module.css'; 

export default function BrandPage({ params }) {
  return (
    <div className={`container ${styles.main}`}>
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Brand: {params.slug.replace('-', ' ').toUpperCase()}</h1>
        <div className={styles.emptyState} style={{ padding: '4rem', textAlign: 'center', background: 'hsl(var(--secondary))', borderRadius: '12px' }}>
          <p>Brand landing pages coming soon.</p>
        </div>
      </section>
    </div>
  );
}
