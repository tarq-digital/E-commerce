-- Phase 13.6: Enterprise Pricing & Promotions Schema

-- 1. Promotions (Core Engine)
CREATE TABLE IF NOT EXISTS promotions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('FIXED', 'PERCENTAGE') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    
    -- Application targets
    target_type ENUM('STORE', 'CATEGORY', 'BRAND', 'PRODUCT') DEFAULT 'STORE',
    target_id INT NULL, -- NULL means Store-wide. Otherwise relates to Category/Brand/Product IDs
    
    -- Priority Engine (Product > Category > Brand > Store)
    priority INT DEFAULT 0,
    
    -- Automatic vs Coupon
    is_automatic BOOLEAN DEFAULT TRUE,
    
    -- Rules
    min_cart_value DECIMAL(10,2) DEFAULT 0.00,
    max_discount_value DECIMAL(10,2) NULL, -- For percentage capping
    
    -- Lifecycle/Scheduling
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NULL,
    status ENUM('ACTIVE', 'PAUSED', 'SCHEDULED', 'EXPIRED') DEFAULT 'ACTIVE',
    
    -- Stackability (Architecture prep)
    can_stack BOOLEAN DEFAULT FALSE,
    stack_group VARCHAR(50) NULL,
    
    -- Versioning (Architecture prep)
    version INT DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Coupons (If is_automatic is FALSE, it needs a coupon code)
CREATE TABLE IF NOT EXISTS coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promotion_id INT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    
    -- Usage Limits
    usage_limit INT NULL, -- Total times this code can be used globally
    usage_count INT DEFAULT 0, -- Tracked usage
    per_customer_limit INT DEFAULT 1,
    
    -- New Customer Constraint
    first_order_only BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE
);

-- 3. Promotion History / Ledger
CREATE TABLE IF NOT EXISTS promotion_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) NOT NULL, -- UUID from orders table
    promotion_id INT NULL,
    coupon_id INT NULL,
    
    discount_amount DECIMAL(10,2) NOT NULL,
    discount_type ENUM('LINE_ITEM', 'CART_LEVEL') NOT NULL,
    target_id INT NULL, -- The product/variant id this applied to (if LINE_ITEM)
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE SET NULL,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
);

-- 4. Future Architecture Placeholders

-- Coupon Usage Locks (Reserve -> Consume flow)
CREATE TABLE IF NOT EXISTS coupon_reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    coupon_id INT NOT NULL,
    user_id INT NOT NULL,
    checkout_session_id VARCHAR(36) NOT NULL,
    status ENUM('RESERVED', 'CONSUMED', 'RELEASED') DEFAULT 'RESERVED',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);

-- Price Books (B2B, Regional Pricing)
CREATE TABLE IF NOT EXISTS price_books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    currency VARCHAR(3) DEFAULT 'INR', -- Multi-Currency prep
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bundle Pricing Rules
CREATE TABLE IF NOT EXISTS bundle_rules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    discount_type ENUM('FIXED', 'PERCENTAGE') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A/B Promotion Tests
CREATE TABLE IF NOT EXISTS promotion_ab_tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    promotion_a_id INT NOT NULL,
    promotion_b_id INT NOT NULL,
    status ENUM('RUNNING', 'COMPLETED') DEFAULT 'RUNNING'
);
