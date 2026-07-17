import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './SectionHeader.module.css';
import { cn } from '../../../utils/cn';

export const SectionHeader = ({ title, subtitle, actionText, actionHref, className }) => {
  return (
    <div className={cn(styles.header, className)}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actionText && actionHref && (
        <Link href={actionHref} className={styles.action}>
          {actionText} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
};
