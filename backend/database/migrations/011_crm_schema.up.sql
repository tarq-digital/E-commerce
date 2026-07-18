-- Phase 13.5: Enterprise Customer Relationship Management (CRM) Schema

-- 1. Account Status (Backward Compatible)
-- We retain is_active and add account_status as an ENUM
-- (Commented out because it partially succeeded and causes duplicates)
-- ALTER TABLE users 
-- ADD COLUMN account_status ENUM('ACTIVE', 'BLOCKED', 'SUSPENDED', 'DEACTIVATED', 'ANONYMIZED') DEFAULT 'ACTIVE' AFTER is_active;

-- Sync existing data
UPDATE users SET account_status = 'ACTIVE' WHERE is_active = TRUE;
UPDATE users SET account_status = 'BLOCKED' WHERE is_active = FALSE;

-- 2. Customer Trust & Risk Architecture (Placeholder)
-- ALTER TABLE users 
-- ADD COLUMN trust_score INT DEFAULT 100 AFTER account_status,
-- ADD COLUMN risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'LOW' AFTER trust_score,
-- ADD COLUMN refund_ratio DECIMAL(5,2) DEFAULT 0.00 AFTER risk_level,
-- ADD COLUMN failed_payments INT DEFAULT 0 AFTER refund_ratio,
-- ADD COLUMN chargeback_count INT DEFAULT 0 AFTER failed_payments;

-- 3. Customer Consent Architecture (Placeholder)
-- ALTER TABLE users 
-- ADD COLUMN email_consent BOOLEAN DEFAULT TRUE AFTER chargeback_count,
-- ADD COLUMN sms_consent BOOLEAN DEFAULT FALSE AFTER email_consent,
-- ADD COLUMN whatsapp_consent BOOLEAN DEFAULT FALSE AFTER sms_consent,
-- ADD COLUMN marketing_consent BOOLEAN DEFAULT FALSE AFTER whatsapp_consent,
-- ADD COLUMN data_export_requested_at TIMESTAMP NULL AFTER marketing_consent,
-- ADD COLUMN deletion_requested_at TIMESTAMP NULL AFTER data_export_requested_at;

-- 4. Customer Notes
CREATE TABLE IF NOT EXISTS customer_notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    admin_id INT NOT NULL,
    type ENUM('GENERAL', 'VIP', 'FRAUD', 'SUPPORT') DEFAULT 'GENERAL',
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Customer Tags
-- Add color to existing tags table (from 002) if not exists
-- ALTER TABLE tags ADD COLUMN color VARCHAR(20) DEFAULT 'gray';

CREATE TABLE IF NOT EXISTS customer_tags (
    user_id INT NOT NULL,
    tag_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, tag_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Pre-seed tags
INSERT IGNORE INTO tags (name, color) VALUES 
('VIP', 'purple'), 
('Wholesale', 'blue'), 
('High Value', 'green'), 
('Fraud Risk', 'red');

-- 6. Architecture Placeholders (Do not implement logic for these yet)
CREATE TABLE IF NOT EXISTS customer_segments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    rule_definition JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loyalty_program (
    user_id INT PRIMARY KEY,
    points_balance INT DEFAULT 0,
    lifetime_points INT DEFAULT 0,
    tier ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM') DEFAULT 'BRONZE',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
