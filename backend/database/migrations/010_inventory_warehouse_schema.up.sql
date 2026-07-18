-- Phase 13.4: Enterprise Inventory & Warehouse Management Schema

-- 1. Create Warehouses Table (Architecture Placeholder)
CREATE TABLE IF NOT EXISTS warehouses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location_address TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed a default primary warehouse
INSERT IGNORE INTO warehouses (id, name, location_address) VALUES (1, 'Main Fulfillment Center', 'Headquarters');

-- 2. Modify Inventory Table to support multi-warehouse
-- Drop the foreign key first to allow dropping the index (MySQL auto-generates name inventory_ibfk_1)
ALTER TABLE inventory DROP FOREIGN KEY inventory_ibfk_1;

-- Drop existing unique constraint on variant_id
ALTER TABLE inventory DROP INDEX variant_id;

-- Add warehouse_id and set default to 1 for existing records
ALTER TABLE inventory 
ADD COLUMN warehouse_id INT NOT NULL DEFAULT 1 AFTER variant_id,
ADD CONSTRAINT fk_inventory_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
ADD UNIQUE INDEX idx_inventory_variant_warehouse (variant_id, warehouse_id);

-- Recreate the foreign key for variant_id
ALTER TABLE inventory
ADD CONSTRAINT inventory_ibfk_1 FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE;

-- 3. Modify Inventory Transactions
ALTER TABLE inventory_transactions
ADD COLUMN warehouse_id INT NOT NULL DEFAULT 1 AFTER variant_id,
ADD CONSTRAINT fk_inv_trans_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT;

-- 4. Create Suppliers Table (Architecture Placeholder)
CREATE TABLE IF NOT EXISTS suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Purchase Orders (Architecture Placeholder)
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    po_number VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('DRAFT', 'ISSUED', 'PARTIAL_RECEIPT', 'RECEIVED', 'CANCELLED') DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT
);

-- 6. Create Stock Transfers (Architecture Placeholder)
CREATE TABLE IF NOT EXISTS stock_transfers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_warehouse_id INT NOT NULL,
    to_warehouse_id INT NOT NULL,
    status ENUM('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
    FOREIGN KEY (to_warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT
);
