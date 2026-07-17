"use client";

import React, { useState } from 'react';
import styles from './ProductTabs.module.css';
import { cn } from '../../../utils/cn';
import { ProductReviews } from './ProductReviews';
import { ShippingInfo } from './ShippingInfo';

export const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const { description, specifications } = product;

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders} role="tablist">
        <button 
          role="tab"
          aria-selected={activeTab === 'description'}
          className={cn(styles.tabBtn, activeTab === 'description' && styles.activeTab)}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        {specifications && specifications.length > 0 && (
          <button 
            role="tab"
            aria-selected={activeTab === 'specifications'}
            className={cn(styles.tabBtn, activeTab === 'specifications' && styles.activeTab)}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
        )}
        <button 
          role="tab"
          aria-selected={activeTab === 'reviews'}
          className={cn(styles.tabBtn, activeTab === 'reviews' && styles.activeTab)}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews (4)
        </button>
        <button 
          role="tab"
          aria-selected={activeTab === 'shipping'}
          className={cn(styles.tabBtn, activeTab === 'shipping' && styles.activeTab)}
          onClick={() => setActiveTab('shipping')}
        >
          Shipping & Returns
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'description' && (
          <div className={styles.panel} role="tabpanel">
            <p className={styles.descriptionText}>
              {description || 'Premium collectible featuring exceptional detail. Hand-painted with meticulous care to bring your favorite character to life.'}
            </p>
          </div>
        )}

        {activeTab === 'specifications' && specifications && specifications.length > 0 && (
          <div className={styles.panel} role="tabpanel">
            <table className={styles.specsTable}>
              <tbody>
                {specifications.map((spec, idx) => (
                  <tr key={idx}>
                    <th>{spec.spec_key}</th>
                    <td>{spec.spec_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className={styles.panel} role="tabpanel">
            <ProductReviews />
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className={styles.panel} role="tabpanel">
            <ShippingInfo />
          </div>
        )}
      </div>
    </div>
  );
};
