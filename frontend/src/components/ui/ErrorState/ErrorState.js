import React from 'react';
import { AlertOctagon } from 'lucide-react';
import styles from './ErrorState.module.css';
import { Button } from '../Button/Button';

export const ErrorState = ({ 
  title = "Something went wrong", 
  message = "We encountered an unexpected error while processing your request.",
  onRetry 
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <AlertOctagon size={48} className={styles.icon} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      
      {onRetry && (
        <div className={styles.action}>
          <Button variant="outline" onClick={onRetry}>Try Again</Button>
        </div>
      )}
    </div>
  );
};
