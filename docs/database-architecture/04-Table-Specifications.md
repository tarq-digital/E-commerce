# Table Specifications - Weebster

This document provides the exact schema definitions for the core database tables, intended for direct translation into Prisma models or SQL DDL.

---

## 1. `users` Table
**Purpose:** Core identity table for authentication and profile management.

| Column Name | Data Type | Length | Nullable | Default | Constraints/Indexes |
|-------------|-----------|--------|----------|---------|---------------------|
| `id` | INT | - | No | AUTO_INCREMENT | PRIMARY KEY |
| `email` | VARCHAR | 255 | No | - | UNIQUE INDEX |
| `password_hash` | VARCHAR | 255 | No | - | - |
| `first_name` | VARCHAR | 100 | No | - | - |
| `last_name` | VARCHAR | 100 | Yes | NULL | - |
| `phone` | VARCHAR | 20 | Yes | NULL | - |
| `role` | ENUM | - | No | 'CUSTOMER' | 'CUSTOMER', 'ADMIN' |
| `is_verified` | BOOLEAN | - | No | FALSE | - |
| `created_at` | DATETIME | - | No | CURRENT_TIMESTAMP| - |
| `updated_at` | DATETIME | - | No | CURRENT_TIMESTAMP| ON UPDATE CURRENT_TIMESTAMP |
| `deleted_at` | DATETIME | - | Yes | NULL | Used for Soft Delete |

## 2. `products` Table
**Purpose:** Base catalog entry.

| Column Name | Data Type | Length | Nullable | Default | Constraints/Indexes |
|-------------|-----------|--------|----------|---------|---------------------|
| `id` | INT | - | No | AUTO_INCREMENT | PRIMARY KEY |
| `category_id` | INT | - | Yes | NULL | FOREIGN KEY (`categories.id`) |
| `slug` | VARCHAR | 255 | No | - | UNIQUE INDEX |
| `name` | VARCHAR | 255 | No | - | INDEX (Search) |
| `description` | TEXT | - | Yes | NULL | - |
| `base_price` | DECIMAL | 10,2 | No | - | - |
| `compare_price` | DECIMAL | 10,2 | Yes | NULL | - |
| `is_active` | BOOLEAN | - | No | TRUE | INDEX (Filtering) |
| `average_rating`| DECIMAL | 3,2 | No | 0.00 | - |
| `created_at` | DATETIME | - | No | CURRENT_TIMESTAMP| - |
| `deleted_at` | DATETIME | - | Yes | NULL | Soft Delete |

## 3. `variants` Table
**Purpose:** Specific purchasable SKU.

| Column Name | Data Type | Length | Nullable | Default | Constraints/Indexes |
|-------------|-----------|--------|----------|---------|---------------------|
| `id` | INT | - | No | AUTO_INCREMENT | PRIMARY KEY |
| `product_id` | INT | - | No | - | FOREIGN KEY (`products.id`) ON DELETE CASCADE |
| `sku` | VARCHAR | 100 | No | - | UNIQUE INDEX |
| `name` | VARCHAR | 100 | No | 'Default' | e.g., 'Red' |
| `price_override`| DECIMAL | 10,2 | Yes | NULL | - |

## 4. `inventory` Table
**Purpose:** Physical stock tracking.

| Column Name | Data Type | Length | Nullable | Default | Constraints/Indexes |
|-------------|-----------|--------|----------|---------|---------------------|
| `id` | INT | - | No | AUTO_INCREMENT | PRIMARY KEY |
| `variant_id` | INT | - | No | - | FOREIGN KEY (`variants.id`) ON DELETE CASCADE |
| `warehouse_id` | INT | - | No | 1 | - |
| `qty_available` | INT | - | No | 0 | CHECK (`qty_available` >= 0) |
| `qty_reserved` | INT | - | No | 0 | CHECK (`qty_reserved` >= 0) |

## 5. `orders` Table
**Purpose:** Financial transaction record.

| Column Name | Data Type | Length | Nullable | Default | Constraints/Indexes |
|-------------|-----------|--------|----------|---------|---------------------|
| `id` | INT | - | No | AUTO_INCREMENT | PRIMARY KEY |
| `order_number` | VARCHAR | 50 | No | - | UNIQUE INDEX |
| `user_id` | INT | - | Yes | NULL | FOREIGN KEY (`users.id`) |
| `status` | ENUM | - | No | 'PENDING' | INDEX |
| `grand_total` | DECIMAL | 10,2 | No | - | - |
| `shipping_snapshot`| JSON | - | No | - | Immutable record of address |
| `created_at` | DATETIME | - | No | CURRENT_TIMESTAMP| INDEX (Reporting) |

## 6. `order_items` Table
**Purpose:** Line items for an order.

| Column Name | Data Type | Length | Nullable | Default | Constraints/Indexes |
|-------------|-----------|--------|----------|---------|---------------------|
| `id` | INT | - | No | AUTO_INCREMENT | PRIMARY KEY |
| `order_id` | INT | - | No | - | FOREIGN KEY (`orders.id`) ON DELETE CASCADE |
| `variant_id` | INT | - | Yes | NULL | FOREIGN KEY (`variants.id`) SET NULL |
| `product_name_snap`| VARCHAR| 255 | No | - | - |
| `price_at_purchase`| DECIMAL | 10,2 | No | - | - |
| `quantity` | INT | - | No | 1 | - |
