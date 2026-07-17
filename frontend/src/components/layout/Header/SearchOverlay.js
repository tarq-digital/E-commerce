"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './SearchOverlay.module.css';

export const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => document.getElementById('global-search-input')?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const trending = ["Gundam Aerial", "Jujutsu Kaisen", "Demon Slayer", "Nendoroid"];
  const recent = ["Hatsune Miku", "Bandai"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="container">
            <div className={styles.header}>
              <form onSubmit={handleSearch} className={styles.searchBar}>
                <Search className={styles.searchIcon} size={24} />
                <input
                  id="global-search-input"
                  type="text"
                  placeholder="Search for toys, brands, categories..."
                  className={styles.input}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className={styles.clearBtn}>
                    <X size={20} />
                  </button>
                )}
              </form>
              <button onClick={onClose} className={styles.closeOverlayBtn}>
                Close
              </button>
            </div>
            
            {!query && (
              <div className={styles.suggestions}>
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Clock size={16} /> Recent Searches
                  </h4>
                  <div className={styles.tags}>
                    {recent.map(term => (
                      <button key={term} className={styles.tag} onClick={() => { setQuery(term); document.getElementById('global-search-input')?.focus(); }}>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <TrendingUp size={16} /> Trending Now
                  </h4>
                  <div className={styles.tags}>
                    {trending.map(term => (
                      <button key={term} className={styles.tag} onClick={() => { setQuery(term); document.getElementById('global-search-input')?.focus(); }}>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {query && (
              <div className={styles.resultsPreview}>
                <p className={styles.previewText}>Press Enter to search for "{query}"</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
