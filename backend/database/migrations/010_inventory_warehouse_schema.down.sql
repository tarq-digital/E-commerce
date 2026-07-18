-- Phase 13.4: Enterprise Inventory & Warehouse Management Schema

ALTER TABLE inventory_transactions DROP FOREIGN KEY fk_inv_trans_warehouse;
ALTER TABLE inventory_transactions DROP COLUMN warehouse_id;

ALTER TABLE inventory DROP INDEX idx_inventory_variant_warehouse;
ALTER TABLE inventory DROP FOREIGN KEY fk_inventory_warehouse;
ALTER TABLE inventory DROP COLUMN warehouse_id;
ALTER TABLE inventory ADD UNIQUE INDEX variant_id (variant_id);

DROP TABLE IF EXISTS stock_transfers;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS warehouses;
