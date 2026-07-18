-- Phase 13.7: Enterprise Analytics, Reports & Business Intelligence Schema

-- 1. Security: Export Audit Logging
CREATE TABLE IF NOT EXISTS export_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    report_type VARCHAR(100) NOT NULL, -- e.g. 'SALES_REPORT', 'CUSTOMER_REPORT'
    format ENUM('CSV', 'EXCEL', 'PDF') NOT NULL,
    filters_applied JSON NOT NULL, -- e.g. { "start_date": "...", "end_date": "..." }
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Future Architecture Placeholders

-- Analytics Snapshots (Daily/Weekly/Monthly)
CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    snapshot_type ENUM('DAILY', 'WEEKLY', 'MONTHLY') NOT NULL,
    snapshot_date DATE NOT NULL,
    metrics_json JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY idx_snapshot_type_date (snapshot_type, snapshot_date)
);

-- Dashboard Layouts (Personalization)
CREATE TABLE IF NOT EXISTS dashboard_layouts (
    admin_id INT PRIMARY KEY,
    layout_config JSON NOT NULL, -- e.g. { "hidden_widgets": [], "order": [] }
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Scheduled Reports
CREATE TABLE IF NOT EXISTS scheduled_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    frequency ENUM('DAILY', 'WEEKLY', 'MONTHLY') NOT NULL,
    delivery_method ENUM('EMAIL', 'SFTP') DEFAULT 'EMAIL',
    destination VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'PAUSED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Alert Configurations
CREATE TABLE IF NOT EXISTS alert_configurations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alert_type ENUM('REVENUE_DROP', 'INVENTORY_LOW', 'REFUND_SPIKE', 'PROMOTION_ABUSE') NOT NULL,
    threshold_value DECIMAL(10,2) NOT NULL,
    notification_channels JSON NOT NULL, -- e.g. ["EMAIL", "SLACK"]
    status ENUM('ACTIVE', 'PAUSED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Advanced BI Placeholders
CREATE TABLE IF NOT EXISTS forecasting_models (
    id INT PRIMARY KEY AUTO_INCREMENT,
    model_name VARCHAR(100) NOT NULL,
    status ENUM('TRAINING', 'ACTIVE', 'DEPRECATED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cohort_analysis_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cohort_month VARCHAR(7) NOT NULL, -- e.g. '2026-07'
    metrics JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_churn_predictions (
    user_id INT PRIMARY KEY,
    churn_probability DECIMAL(5,4) NOT NULL, -- e.g. 0.8500
    last_calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
