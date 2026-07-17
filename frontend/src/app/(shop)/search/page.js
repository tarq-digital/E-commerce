import React from 'react';
import styles from '../../page.module.css'; 

export default function SearchPage({ searchParams }) {
  const query = searchParams?.q || '';
  return (
    <div className={`container ${styles.main}`}>
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Search Results {query && `for "${query}"`}</h1>
        <div className={styles.emptyState} style={{ padding: '4rem', textAlign: 'center', background: 'hsl(var(--secondary))', borderRadius: '12px' }}>
          <p>Global search will be implemented in Phase 10.</p>
        </div>
      </section>
    </div>
  );
}
