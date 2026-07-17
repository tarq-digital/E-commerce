import React from 'react';
import styles from '../../page.module.css'; 

export default function SalePage() {
  return (
    <div className={`container ${styles.main}`}>
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Sale</h1>
        <div className={styles.emptyState} style={{ padding: '4rem', textAlign: 'center', background: 'hsl(var(--secondary))', borderRadius: '12px' }}>
          <p>Check out our discounted items.</p>
        </div>
      </section>
    </div>
  );
}
