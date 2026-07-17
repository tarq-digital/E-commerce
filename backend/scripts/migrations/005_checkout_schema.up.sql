-- Phase 12.1: Enterprise Checkout Foundation Schema

CREATE TABLE IF NOT EXISTS user_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shipping_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    min_order_value DECIMAL(10,2) NULL,
    max_weight DECIMAL(10,2) NULL,
    estimated_days INT NULL,
    cod_eligible BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    zone_id VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS checkout_sessions (
    id VARCHAR(36) PRIMARY KEY, -- UUID
    cart_id INT NOT NULL,
    user_id INT NULL,
    guest_token VARCHAR(255) NULL,
    
    contact_email VARCHAR(255) NULL,
    contact_phone VARCHAR(20) NULL,
    
    shipping_address_json JSON NULL,
    billing_address_json JSON NULL,
    
    shipping_method_id INT NULL,
    
    currency VARCHAR(3) DEFAULT 'INR',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shipping_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    applied_coupon_code VARCHAR(50) NULL,
    discount_type ENUM('PERCENT', 'FIXED') NULL,
    discount_value DECIMAL(10,2) NULL,
    
    payment_provider VARCHAR(50) DEFAULT 'razorpay',
    payment_order_id VARCHAR(255) NULL,
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    
    status ENUM('INITIATED', 'CONTACT_SET', 'ADDRESS_SET', 'SHIPPING_SET', 'PAYMENT_PENDING', 'COMPLETED', 'FAILED', 'ABANDONED') DEFAULT 'INITIATED',
    
    client_ip VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    device_fingerprint VARCHAR(255) NULL,
    
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX idx_checkout_sessions_guest_token ON checkout_sessions(guest_token);
CREATE INDEX idx_checkout_sessions_cart_id ON checkout_sessions(cart_id);
CREATE INDEX idx_checkout_sessions_status ON checkout_sessions(status);

-- Insert Default Shipping Methods
INSERT INTO shipping_methods (name, description, price, min_order_value, estimated_days, cod_eligible)
VALUES 
('Standard Shipping', 'Delivery in 5-7 business days', 50.00, NULL, 5, TRUE),
('Free Standard Shipping', 'Free delivery for orders above ₹1000', 0.00, 1000.00, 5, TRUE),
('Express Delivery', 'Delivery in 1-2 business days', 150.00, NULL, 1, FALSE);
