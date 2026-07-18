-- Phase 12.2: Enterprise Payment Gateway & Orders Schema

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY, -- UUID
    user_id INT NULL,
    checkout_session_id VARCHAR(36) NOT NULL,
    
    status ENUM('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
    
    currency VARCHAR(3) DEFAULT 'INR',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_total DECIMAL(10,2) NOT NULL,
    shipping_total DECIMAL(10,2) NOT NULL,
    discount_total DECIMAL(10,2) NOT NULL,
    grand_total DECIMAL(10,2) NOT NULL,
    
    shipping_address_json JSON NOT NULL,
    billing_address_json JSON NOT NULL,
    
    contact_email VARCHAR(255) NULL,
    contact_phone VARCHAR(20) NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (checkout_session_id) REFERENCES checkout_sessions(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) NOT NULL,
    product_id INT NOT NULL,
    variant_id INT NULL,
    
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255) NULL,
    sku VARCHAR(100) NOT NULL,
    
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(36) PRIMARY KEY, -- UUID
    order_id VARCHAR(36) NOT NULL,
    
    gateway VARCHAR(50) DEFAULT 'razorpay',
    razorpay_order_id VARCHAR(255) NULL,
    razorpay_payment_id VARCHAR(255) NULL,
    razorpay_signature VARCHAR(255) NULL,
    
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    
    status ENUM('INITIATED', 'PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'INITIATED',
    idempotency_key VARCHAR(255) NULL UNIQUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_checkout_session_id ON orders(checkout_session_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_razorpay_order_id ON payment_transactions(razorpay_order_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
