import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';

export const ShippingInfo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--surface-hover)', padding: '12px', borderRadius: '50%', color: 'var(--foreground)' }}>
            <Truck size={24} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.125rem' }}>Free Standard Shipping</h4>
            <p style={{ margin: '0', color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Enjoy free standard shipping on all orders over $100. Delivery typically takes 3-5 business days.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--surface-hover)', padding: '12px', borderRadius: '50%', color: 'var(--foreground)' }}>
            <RotateCcw size={24} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.125rem' }}>30-Day Returns</h4>
            <p style={{ margin: '0', color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Not satisfied? Return it in its original condition within 30 days for a full refund or exchange.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--surface-hover)', padding: '12px', borderRadius: '50%', color: 'var(--foreground)' }}>
            <Clock size={24} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.125rem' }}>Express Delivery Available</h4>
            <p style={{ margin: '0', color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Need it faster? Upgrade to Express shipping at checkout for 1-2 business day delivery.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--surface-hover)', padding: '12px', borderRadius: '50%', color: 'var(--foreground)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.125rem' }}>Secure Packaging</h4>
            <p style={{ margin: '0', color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              All collector items are shipped with reinforced corners and bubble wrap to ensure mint condition arrival.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
