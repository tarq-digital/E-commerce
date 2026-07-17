"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import styles from './Newsletter.module.css';
import { Button } from '../../ui/Button/Button';
import { cn } from '../../../utils/cn';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <div className={styles.content}>
          <h2 className={styles.title}>Join the Weebster Club</h2>
          <p className={styles.subtitle}>
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Enter your email address"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                required
              />
              <Button 
                type="submit" 
                variant="primary" 
                className={styles.button}
                isLoading={status === 'loading'}
                disabled={status === 'success'}
              >
                {status === 'success' ? 'Subscribed!' : <><Send size={18} /> Subscribe</>}
              </Button>
            </div>
            {status === 'success' && (
              <p className={styles.successMsg}>Thank you for subscribing!</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
