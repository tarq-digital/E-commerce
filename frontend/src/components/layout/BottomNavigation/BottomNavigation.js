"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './BottomNavigation.module.css';
import { cn } from '../../../utils/cn';

export const BottomNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories', icon: LayoutGrid },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Cart', href: '/cart', icon: ShoppingBag },
    { name: 'Account', href: '/account', icon: User },
  ];

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

        return (
          <Link key={item.name} href={item.href} className={cn(styles.navItem, isActive && styles.active)}>
            <div className={styles.iconWrapper}>
              <Icon size={24} className={styles.icon} />
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className={styles.indicator}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </div>
            <span className={styles.label}>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
