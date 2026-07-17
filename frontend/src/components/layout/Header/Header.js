"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, ShoppingBag, Heart, User } from 'lucide-react';
import styles from './Header.module.css';
import { SearchOverlay } from './SearchOverlay';
import { CartBadge } from './CartBadge';
import { CartDrawer } from '../../cart/CartDrawer/CartDrawer';
import { cn } from '../../../utils/cn';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={cn(styles.header, isScrolled && styles.scrolled)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.left}>
            <Link href="/" className={styles.logo}>
              Weebster
            </Link>
          </div>
          
          <div className={styles.center}>
            <nav className={styles.megaMenu}>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <Link href="/shop" className={styles.navLink}>Shop</Link>
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownContent}>
                      <div className={styles.dropdownSection}>
                        <h4>Categories</h4>
                        <Link href="/categories">Action Figures</Link>
                        <Link href="/categories">Statues & Busts</Link>
                        <Link href="/categories">Premium Plush</Link>
                      </div>
                      <div className={styles.dropdownSection}>
                        <h4>Brands</h4>
                        <Link href="/brand/bandai">Bandai</Link>
                        <Link href="/brand/good-smile">Good Smile Company</Link>
                        <Link href="/brand/kotobukiya">Kotobukiya</Link>
                      </div>
                    </div>
                  </div>
                </li>
                <li className={styles.navItem}><Link href="/new-arrivals" className={styles.navLink}>New</Link></li>
                <li className={styles.navItem}><Link href="/sale" className={styles.navLink}>Sale</Link></li>
              </ul>
            </nav>

            <button className={styles.searchTriggerDesktop} onClick={() => setIsSearchOpen(true)}>
              <Search size={20} className={styles.searchIcon} />
              <span className={styles.searchText}>Search premium toys...</span>
            </button>
          </div>

          <div className={styles.right}>
            <button className={styles.iconButton} onClick={() => setIsSearchOpen(true)}>
              <Search size={24} />
            </button>
            <Link href="/wishlist" className={cn(styles.iconButton, styles.desktopOnly)}>
              <Heart size={24} />
            </Link>
            <Link href="/account" className={cn(styles.iconButton, styles.desktopOnly)}>
              <User size={24} />
            </Link>
            <CartBadge />
            <button className={cn(styles.iconButton, styles.mobileOnly)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
    </>
  );
};
