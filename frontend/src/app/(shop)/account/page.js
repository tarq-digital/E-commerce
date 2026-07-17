import React from 'react';
import styles from '../../page.module.css'; 

export default function AccountPage() {
  return (
    <div className={`container ${styles.main}`}>
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>My Account</h1>
        <div className={styles.emptyState} style={{ padding: '4rem', textAlign: 'center', background: 'hsl(var(--secondary))', borderRadius: '12px' }}>
          <p>Please log in to view your orders and settings.</p>
        </div>
      </section>
    </div>
  );
}
