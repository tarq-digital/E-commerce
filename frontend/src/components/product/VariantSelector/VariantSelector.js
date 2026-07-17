"use client";

import React, { useState } from 'react';
import styles from './VariantSelector.module.css';
import { cn } from '../../../utils/cn';

export const VariantSelector = ({ variants, onSelect }) => {
  const [selected, setSelected] = useState(variants?.[0]?.id || null);

  if (!variants || variants.length === 0) return null;

  return (
    <div className={styles.container}>
      <h4 className={styles.label}>Select Option</h4>
      <div className={styles.options}>
        {variants.map(variant => (
          <button
            key={variant.id}
            className={cn(styles.option, selected === variant.id && styles.selected)}
            onClick={() => {
              setSelected(variant.id);
              onSelect && onSelect(variant);
            }}
          >
            <span className={styles.sku}>{variant.sku}</span>
            <span className={styles.price}>${parseFloat(variant.price).toFixed(2)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
