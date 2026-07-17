import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Dummy static reviews for architecture planning
const reviews = [
  { id: 1, author: "Alex M.", rating: 5, date: "May 12, 2026", content: "Absolutely stunning detail. The articulation allows for dynamic poses without feeling flimsy. Best purchase this year.", verified: true },
  { id: 2, author: "Sarah T.", rating: 5, date: "April 28, 2026", content: "Arrived in perfect condition. The paint job is flawless and it looks amazing on my shelf.", verified: true },
  { id: 3, author: "John D.", rating: 4, date: "April 15, 2026", content: "Great figure, but the stand could be a bit sturdier. Still highly recommend it for any collector.", verified: true },
  { id: 4, author: "Emily R.", rating: 5, date: "March 30, 2026", content: "Exceeded my expectations! Shipping was fast and the packaging was very secure.", verified: false }
];

export const ProductReviews = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', minWidth: '150px' }}>
          <h2 style={{ fontSize: '3rem', margin: '0' }}>4.8</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', color: '#f59e0b', margin: '8px 0' }}>
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} />
          </div>
          <p style={{ margin: '0', color: 'var(--muted-foreground)' }}>Based on 4 reviews</p>
        </div>
        
        <div style={{ flex: 1, minWidth: '300px' }}>
          {[5,4,3,2,1].map(star => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ minWidth: '40px', color: 'var(--muted-foreground)' }}>{star} Stars</span>
              <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--surface)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  backgroundColor: '#f59e0b', 
                  width: star === 5 ? '75%' : star === 4 ? '25%' : '0%' 
                }} />
              </div>
              <span style={{ minWidth: '30px', textAlign: 'right', color: 'var(--muted-foreground)' }}>
                {star === 5 ? '3' : star === 4 ? '1' : '0'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {reviews.map(review => (
          <div key={review.id} style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1.125rem' }}>{review.author}</strong>
                  {review.verified && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--success)' }}>
                      <CheckCircle size={12} /> Verified Buyer
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '2px', color: '#f59e0b', marginTop: '4px' }}>
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} fill={i < review.rating ? "currentColor" : "none"} size={14} />
                  ))}
                </div>
              </div>
              <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{review.date}</span>
            </div>
            <p style={{ margin: '0', color: 'var(--muted-foreground)', lineHeight: '1.6' }}>{review.content}</p>
          </div>
        ))}
      </div>

      <button style={{ 
        alignSelf: 'center', 
        padding: '12px 32px', 
        background: 'transparent', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s'
      }}>
        Load More Reviews
      </button>

    </div>
  );
};
