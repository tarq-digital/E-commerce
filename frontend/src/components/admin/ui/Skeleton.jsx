import React from 'react';

export function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseStyles = 'animate-pulse bg-gray-200';
  
  const variants = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded-md h-4 w-3/4',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} />
  );
}
