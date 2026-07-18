-- Phase 13.3: Order State Machine Expansion

-- We are altering the orders table to change the status column from ENUM to VARCHAR(50)
-- This provides dynamic state machine capabilities without requiring future migrations
-- The application logic will enforce the states.
ALTER TABLE orders 
MODIFY status VARCHAR(50) DEFAULT 'ORDER_CREATED';

-- Update existing records to match the new state terminology (if they exist)
UPDATE orders SET status = 'ORDER_CREATED' WHERE status = 'PENDING';
UPDATE orders SET status = 'CONFIRMED' WHERE status = 'PROCESSING';
UPDATE orders SET status = 'DELIVERED' WHERE status = 'DELIVERED';
UPDATE orders SET status = 'CANCELLED' WHERE status = 'CANCELLED';
UPDATE orders SET status = 'REFUNDED' WHERE status = 'REFUNDED';
UPDATE orders SET status = 'SHIPPED' WHERE status = 'SHIPPED';
-- Note: 'PAID' from the old ENUM wasn't a standard fulfillment state, we map it to CONFIRMED
UPDATE orders SET status = 'CONFIRMED' WHERE status = 'PAID';

-- Add placeholders for order holds
ALTER TABLE orders
ADD COLUMN hold_reason TEXT NULL,
ADD COLUMN is_on_hold BOOLEAN DEFAULT FALSE;

-- Add placeholders for fraud/risk
ALTER TABLE orders
ADD COLUMN risk_score INT DEFAULT 0,
ADD COLUMN manual_review_flag BOOLEAN DEFAULT FALSE,
ADD COLUMN payment_verification_flag BOOLEAN DEFAULT FALSE;
