import React from 'react';
import { ShieldCheck, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react';
import styles from './TrustBadges.module.css';

export const TrustBadges = () => {
  const badges = [
    {
      id: 1,
      icon: ShieldCheck,
      title: "100% Authentic",
      desc: "Guaranteed genuine products"
    },
    {
      id: 2,
      icon: Truck,
      title: "Fast Delivery",
      desc: "Free shipping over $100"
    },
    {
      id: 3,
      icon: RotateCcw,
      title: "Easy Returns",
      desc: "30-day return policy"
    },
    {
      id: 4,
      icon: HeadphonesIcon,
      title: "24/7 Support",
      desc: "Dedicated customer service"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid}`}>
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.id} className={styles.badge}>
              <div className={styles.iconWrapper}>
                <Icon size={32} className={styles.icon} />
              </div>
              <h4 className={styles.title}>{badge.title}</h4>
              <p className={styles.desc}>{badge.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
