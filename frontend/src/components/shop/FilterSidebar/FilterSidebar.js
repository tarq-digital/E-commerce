"use client";

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './FilterSidebar.module.css';
import { Button } from '../../ui/Button/Button';
import { Drawer } from '../../ui/Drawer/Drawer';
import { cn } from '../../../utils/cn';

const categories = [
  { label: 'Action Figures', value: 'action-figures' },
  { label: 'Statues & Busts', value: 'statues' },
  { label: 'Model Kits', value: 'model-kits' },
  { label: 'Plush', value: 'plush' },
];

const brands = [
  { label: 'Bandai', value: 'bandai' },
  { label: 'Good Smile', value: 'good-smile' },
  { label: 'Kotobukiya', value: 'kotobukiya' },
  { label: 'Megahouse', value: 'megahouse' },
];

export const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync state with URL params if needed, for now simplistic local state
  const [selectedCats, setSelectedCats] = useState(searchParams.getAll('category') || []);
  const [selectedBrands, setSelectedBrands] = useState(searchParams.getAll('brand') || []);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('brand');
    selectedCats.forEach(c => params.append('category', c));
    selectedBrands.forEach(b => params.append('brand', b));
    router.push(`/shop?${params.toString()}`);
    setIsMobileOpen(false);
  };

  const handleClear = () => {
    setSelectedCats([]);
    setSelectedBrands([]);
    router.push('/shop');
    setIsMobileOpen(false);
  };

  const FilterContent = () => (
    <div className={styles.filterContent}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Categories</h4>
        <div className={styles.options}>
          {categories.map(c => (
            <label key={c.value} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={selectedCats.includes(c.value)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedCats([...selectedCats, c.value]);
                  else setSelectedCats(selectedCats.filter(v => v !== c.value));
                }}
                className={styles.checkbox}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Brands</h4>
        <div className={styles.options}>
          {brands.map(b => (
            <label key={b.value} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={selectedBrands.includes(b.value)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedBrands([...selectedBrands, b.value]);
                  else setSelectedBrands(selectedBrands.filter(v => v !== b.value));
                }}
                className={styles.checkbox}
              />
              {b.label}
            </label>
          ))}
        </div>
      </div>
      
      <div className={styles.actions}>
        <Button variant="outline" fullWidth onClick={handleClear}>Clear All</Button>
        <Button variant="primary" fullWidth onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(styles.sidebar, styles.desktopOnly)}>
        <div className={styles.header}>
          <h3 className={styles.title}><Filter size={20} /> Filters</h3>
        </div>
        <FilterContent />
      </aside>

      {/* Mobile Trigger */}
      <Button 
        variant="outline" 
        className={cn(styles.mobileTrigger, styles.mobileOnly)}
        onClick={() => setIsMobileOpen(true)}
        leftIcon={<Filter size={18} />}
      >
        Filters
      </Button>

      {/* Mobile Drawer */}
      <div className={styles.mobileOnly}>
        <Drawer 
          isOpen={isMobileOpen} 
          onClose={() => setIsMobileOpen(false)}
          title="Filters"
          position="right"
        >
          <FilterContent />
        </Drawer>
      </div>
    </>
  );
};
