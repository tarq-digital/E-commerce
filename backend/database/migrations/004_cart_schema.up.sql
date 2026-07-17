-- 004_cart_schema.up.sql

CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    cart_token VARCHAR(255) NULL UNIQUE,
    status ENUM('ACTIVE', 'ABANDONED', 'CONVERTED', 'EXPIRED') DEFAULT 'ACTIVE',
    currency VARCHAR(3) DEFAULT 'USD',
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT NULL,
    quantity INT NOT NULL DEFAULT 1,
    product_snapshot_name VARCHAR(255) NOT NULL,
    product_snapshot_sku VARCHAR(100) NOT NULL,
    selected_variant_name VARCHAR(255) NULL,
    selected_variant_values JSON NULL,
    metadata JSON NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    UNIQUE KEY idx_unique_cart_item (cart_id, product_id, variant_id)
);
