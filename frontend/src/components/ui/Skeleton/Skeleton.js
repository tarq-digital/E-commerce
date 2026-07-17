import React from 'react';
import styles from './Skeleton.module.css';
import { cn } from '../../../utils/cn';

export const Skeleton = ({ className, circle, ...props }) => {
  return (
    <div 
      className={cn(
        styles.skeleton, 
        circle && styles.circle, 
        className
      )} 
      {...props} 
    />
  );
};
