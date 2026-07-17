import React from 'react';
import { PackageOpen } from 'lucide-react';
import styles from './EmptyState.module.css';
import { Button } from '../Button/Button';
import Link from 'next/link';

export const EmptyState = ({ 
  icon: Icon = PackageOpen, 
  title = "No items found", 
  description = "We couldn't find anything matching your criteria.",
  actionText,
  actionHref,
  onAction
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Icon size={48} className={styles.icon} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      
      {actionText && (
        <div className={styles.action}>
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="primary">{actionText}</Button>
            </Link>
          ) : (
            <Button variant="primary" onClick={onAction}>{actionText}</Button>
          )}
        </div>
      )}
    </div>
  );
};
