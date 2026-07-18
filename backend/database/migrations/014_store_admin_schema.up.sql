-- Phase 13.8 & 13.9: Enterprise Store Administration Schema

-- 1. Enhanced Store Settings KV Store
CREATE TABLE IF NOT EXISTS store_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    group_name VARCHAR(50) NOT NULL, -- 'GENERAL', 'BRANDING', 'TAX', 'SHIPPING', 'PAYMENT', 'EMAIL', 'LEGAL', 'SYSTEM'
    type ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') DEFAULT 'STRING',
    is_secret BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE, -- e.g. store_name is public, smtp_password is not
    validation_rule VARCHAR(255) NULL, -- Optional regex or keyword for validation engine
    updated_by INT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Settings Audit Trail
CREATE TABLE IF NOT EXISTS settings_audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    setting_key VARCHAR(100) NOT NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Settings Versioning (Architecture Placeholder)
CREATE TABLE IF NOT EXISTS settings_versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    version_hash VARCHAR(64) NOT NULL UNIQUE,
    settings_snapshot JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enterprise Media Manager

-- Hierarchical Folders
CREATE TABLE IF NOT EXISTS media_folders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES media_folders(id) ON DELETE CASCADE,
    UNIQUE KEY idx_folder_name_parent (name, parent_id)
);

-- Media Assets
CREATE TABLE IF NOT EXISTS media_assets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    folder_id INT NULL,
    filename VARCHAR(255) NOT NULL,
    public_id VARCHAR(255) NOT NULL UNIQUE, -- Cloudinary public_id
    secure_url VARCHAR(1024) NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    size_bytes INT NOT NULL,
    alt_text VARCHAR(255) NULL,
    width INT NULL,
    height INT NULL,
    uploaded_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES media_folders(id) ON DELETE SET NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Media Asset Versioning (Architecture Placeholder)
CREATE TABLE IF NOT EXISTS media_asset_versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    secure_url VARCHAR(1024) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES media_assets(id) ON DELETE CASCADE
);

-- 3. Advanced Placeholders

CREATE TABLE IF NOT EXISTS multi_store_configs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_code VARCHAR(50) NOT NULL UNIQUE,
    store_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS language_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lang_code VARCHAR(10) NOT NULL,
    translation_key VARCHAR(255) NOT NULL,
    translation_value TEXT NOT NULL,
    UNIQUE KEY idx_lang_key (lang_code, translation_key)
);

CREATE TABLE IF NOT EXISTS currency_rates (
    currency_code VARCHAR(3) PRIMARY KEY,
    base_rate DECIMAL(10,6) NOT NULL,
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scheduled_configs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL,
    future_value TEXT NOT NULL,
    apply_at TIMESTAMP NOT NULL,
    status ENUM('PENDING', 'APPLIED', 'CANCELLED') DEFAULT 'PENDING'
);
