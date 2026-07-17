"use client";

import React from 'react';
import styles from './VariantSelector.module.css';
import { cn } from '../../../utils/cn';

export const VariantSelector = ({ variants, selectedVariant, onSelect }) => {
  if (!variants || variants.length <= 1) return null;

  // In a robust implementation with multiple attributes (e.g., Color and Size),
  // we would extract unique attribute keys and render separate dropdowns/swatches.
  // For this schema, we map the variant directly, using its attributes or SKU as label.
  
  const getVariantLabel = (v) => {
    if (v.attributes && Object.keys(v.attributes).length > 0) {
      return Object.values(v.attributes).join(' - ');
    }
    return v.sku;
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.label}>Select Option</h4>
      <div className={styles.options}>
        {variants.map(variant => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.available_stock <= 0;
          
          return (
            <button
              key={variant.id}
              disabled={isOutOfStock}
              className={cn(
                styles.option, 
                isSelected && styles.selected,
                isOutOfStock && styles.outOfStock
              )}
              onClick={() => onSelect && onSelect(variant)}
              aria-label={`Select ${getVariantLabel(variant)}`}
            >
              <span className={styles.sku}>{getVariantLabel(variant)}</span>
              {!isOutOfStock && <span className={styles.price}>${parseFloat(variant.price).toFixed(2)}</span>}
              {isOutOfStock && <span className={styles.price}>Sold Out</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
