-- Phase 12.3: Order Management Engine Schema

CREATE TABLE IF NOT EXISTS order_timeline (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT NULL,
    created_by_type ENUM('SYSTEM', 'ADMIN', 'CUSTOMER') DEFAULT 'SYSTEM',
    created_by_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_shipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) NOT NULL,
    shipment_provider VARCHAR(100) NULL,
    courier_name VARCHAR(100) NULL,
    awb_number VARCHAR(100) NULL,
    tracking_number VARCHAR(100) NULL,
    tracking_url VARCHAR(255) NULL,
    dispatched_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) NOT NULL,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    gstin VARCHAR(50) NULL,
    cgst DECIMAL(10,2) DEFAULT 0,
    sgst DECIMAL(10,2) DEFAULT 0,
    igst DECIMAL(10,2) DEFAULT 0,
    hsn_code VARCHAR(20) NULL,
    billing_address_snapshot JSON NOT NULL,
    pdf_s3_url VARCHAR(255) NULL,
    status ENUM('DRAFT', 'ISSUED', 'CANCELLED') DEFAULT 'DRAFT',
    issued_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS returns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) NOT NULL,
    reason_id INT NULL,
    customer_note TEXT NULL,
    images_json JSON NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'RECEIVED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS refunds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) NOT NULL,
    return_id INT NULL,
    amount DECIMAL(10,2) NOT NULL,
    refund_gateway_id VARCHAR(255) NULL,
    status ENUM('PENDING', 'PROCESSED', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    previous_state VARCHAR(50) NULL,
    new_state VARCHAR(50) NULL,
    actor_id INT NULL,
    actor_type ENUM('SYSTEM', 'ADMIN', 'CUSTOMER') DEFAULT 'SYSTEM',
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_timeline_order_id ON order_timeline(order_id);
CREATE INDEX idx_shipments_order_id ON order_shipments(order_id);
CREATE INDEX idx_invoices_order_id ON invoices(order_id);
CREATE INDEX idx_returns_order_id ON returns(order_id);
CREATE INDEX idx_refunds_order_id ON refunds(order_id);
CREATE INDEX idx_audit_logs_order_id ON order_audit_logs(order_id);
