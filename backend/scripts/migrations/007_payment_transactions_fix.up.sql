-- Fix for payment_transactions to allow storing pending sessions

ALTER TABLE payment_transactions DROP FOREIGN KEY payment_transactions_ibfk_1;

-- 2. Add session_id column to link to checkout_sessions
ALTER TABLE payment_transactions ADD COLUMN session_id VARCHAR(36) NULL AFTER id;

-- 3. Make order_id nullable because the transaction is created before the order exists
ALTER TABLE payment_transactions MODIFY order_id VARCHAR(36) NULL;

-- 4. Add the foreign key for session_id
ALTER TABLE payment_transactions ADD CONSTRAINT fk_payment_session FOREIGN KEY (session_id) REFERENCES checkout_sessions(id) ON DELETE SET NULL;

-- 5. Re-add foreign key for order_id
ALTER TABLE payment_transactions ADD CONSTRAINT payment_transactions_ibfk_1 FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
