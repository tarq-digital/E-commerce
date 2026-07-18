-- 008_admin_foundation.up.sql

-- 1. Expanded RBAC Strategy
-- We insert new roles if they don't already exist.
INSERT IGNORE INTO roles (name, description) VALUES 
('MANAGER', 'Can manage catalog, users, and view orders'),
('WAREHOUSE', 'Only has inventory and shipment permissions'),
('SUPPORT', 'Only has read orders and manage users permissions'),
('MARKETING', 'Can manage banners, coupons, and campaigns'),
('ANALYST', 'Read-only access to dashboard and reports');

-- Expand permissions
INSERT IGNORE INTO permissions (name, description) VALUES 
-- Dashboard
('READ_DASHBOARD', 'Can view admin dashboard metrics'),
-- Inventory & Shipments
('MANAGE_INVENTORY', 'Can manage product stock and inventory transactions'),
('MANAGE_SHIPMENTS', 'Can manage order shipments and tracking'),
-- Orders
('READ_ORDERS', 'Can view customer orders'),
-- Coupons & Marketing
('MANAGE_COUPONS', 'Can manage discount coupons'),
('MANAGE_BANNERS', 'Can manage homepage banners'),
-- Settings
('MANAGE_SETTINGS', 'Can manage global store settings');

-- Assign Dashboard to all admin roles
INSERT IGNORE INTO role_permissions (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE p.name = 'READ_DASHBOARD' AND r.name IN ('ADMIN', 'MANAGER', 'WAREHOUSE', 'SUPPORT', 'MARKETING', 'ANALYST');

-- Manager Permissions
INSERT IGNORE INTO role_permissions (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'MANAGER' AND p.name IN ('MANAGE_USERS', 'MANAGE_PRODUCTS', 'MANAGE_ORDERS', 'READ_ORDERS');

-- Warehouse Permissions
INSERT IGNORE INTO role_permissions (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'WAREHOUSE' AND p.name IN ('MANAGE_INVENTORY', 'MANAGE_SHIPMENTS');

-- Support Permissions
INSERT IGNORE INTO role_permissions (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'SUPPORT' AND p.name IN ('READ_ORDERS', 'MANAGE_USERS');

-- Admin Notification Architecture
CREATE TABLE IF NOT EXISTS admin_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- e.g. 'LOW_STOCK', 'NEW_ORDER', 'SYSTEM_ALERT'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(255) NULL, -- Optional link to the resource
  is_read BOOLEAN DEFAULT FALSE,
  target_role_id INT NULL, -- If null, broadcasts to all admins
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (target_role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Admin Preferences Architecture
CREATE TABLE IF NOT EXISTS admin_preferences (
  user_id INT PRIMARY KEY,
  theme ENUM('LIGHT', 'DARK', 'SYSTEM') DEFAULT 'SYSTEM',
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  sidebar_collapsed BOOLEAN DEFAULT FALSE,
  dashboard_layout JSON NULL, -- Future drag-and-drop layout
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
