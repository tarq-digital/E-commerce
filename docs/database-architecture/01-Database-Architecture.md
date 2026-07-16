# Database Architecture - Weebster

This document outlines the overarching database architecture strategy for the Weebster e-commerce platform. It dictates how data is stored, normalized, and managed to ensure absolute data integrity and high performance under load.

---

## 1. Architecture Goals
- **Data Integrity (ACID):** Financial transactions (orders, payments, inventory deductions) must be strictly reliable. No lost orders or double-spending of inventory.
- **Scalability:** The schema must support a catalog growing from 50 to 10,000+ products, and millions of rows in the `orders` and `activity_logs` tables without degrading read performance.
- **Extensibility:** The schema must support future additions (Blogs, Multiple Warehouses, Loyalty Programs) without requiring breaking migrations to existing core tables.
- **Auditability:** Every critical state change (order status update, inventory adjustment) must be traceable to a specific user and timestamp.

## 2. Design Philosophy
- **RDBMS First:** We use **MySQL 8.0+** because e-commerce data is highly relational. A product has variants, variants have inventory, orders contain variants. NoSQL (e.g., MongoDB) introduces unnecessary complexity in enforcing these strict relationships and transactional guarantees.
- **Prisma ORM:** We interact with MySQL via Prisma. This provides an auto-generated, safe query builder for our Node.js backend and handles migration state declaratively.
- **Soft Deletes:** Critical business data (Users, Products, Orders) is *never* physically deleted (`DELETE FROM`). We use a `deleted_at` timestamp. This preserves historical order receipts and reporting integrity.

## 3. Normalization vs. Denormalization Strategy

### Normalization (Default Rule)
The database is generally modeled to **3rd Normal Form (3NF)**.
- *Why:* Reduces data redundancy and anomaly risks during updates.
- *Example:* User addresses are stored in a separate `addresses` table, not as columns on the `users` table, because a user can have multiple addresses.

### Strategic Denormalization (Exceptions)
We selectively denormalize for read performance and historical integrity.
- *Example (Historical Integrity):* When an order is placed, we copy the current product `price` and `name` into the `order_items` table. We do NOT just link `order_items.variant_id` to `variants.price`. 
- *Why:* If the admin changes the price of a toy next year, the historical receipt from today must not change.
- *Example (Performance):* Storing `total_reviews` and `average_rating` directly on the `products` table, updated via database triggers or background jobs, to avoid a massive `COUNT()` and `AVG()` `JOIN` on every page load of the product catalog.

## 4. Naming Standards
Strict naming conventions ensure maintainability across the engineering team.
- **Tables:** `snake_case`, strictly plural (e.g., `users`, `product_variants`, `order_items`).
- **Columns:** `snake_case`, singular (e.g., `first_name`, `price`, `stock_quantity`).
- **Primary Keys:** Always named `id` (e.g., `id` in the `users` table, not `user_id`).
- **Foreign Keys:** Always named `singular_table_name_id` (e.g., `user_id`, `product_id`).
- **Booleans:** Must be prefixed with `is_` or `has_` (e.g., `is_active`, `has_discount`).
- **Timestamps:** Standardized as `created_at`, `updated_at`, `deleted_at`.

## 5. Scalability & Future Expansion Strategy
The core schema is partitioned conceptually:
- **Core Catalog:** `products`, `categories`, `variants`.
- **Commerce Engine:** `orders`, `payments`, `inventory`.
- **Identity:** `users`, `sessions`, `roles`.

To scale to multiple physical stores or warehouses, the `inventory` table relies on a `warehouse_id` (which currently defaults to 1). This ensures that moving to a multi-node warehouse system in the future requires UI changes, but zero database restructuring.

## 6. Tradeoffs
- **MySQL vs PostgreSQL:** PostgreSQL offers better JSON querying and advanced features, but MySQL 8.0 has excellent JSON support and is often easier to configure and scale cost-effectively on managed VPS hosts like Hostinger.
- **UUIDs vs Auto-Incrementing Integers (INT):** 
  - We use `INT AUTO_INCREMENT` for internal Primary Keys (smaller index size, faster joins).
  - We use `UUID` or `CUID` for externally exposed references (e.g., `order_number: "ORD-98A7B6"`) to prevent competitor scraping (they can't guess how many orders we process by looking at an incremental ID).
