# 07 Database Audit

## 1. Overview
This audit evaluates the physical database schema, migrations, transaction integrity, indexing, and data relationship constraints.

## 2. Migration System
- **Implementation:** Custom Node.js script (`scripts/migrate.js`) executing `.up.sql` files sequentially.
- **Audit Result:** Effective, but highly sensitive to non-transactional DDL statements in MySQL. As seen during the Phase 13 updates, `ALTER TABLE` operations cannot be rolled back if they crash halfway through. This requires developers to manually comment out executed SQL lines to resume broken migrations. 
- **Recommendation:** Implement a strict rule: One DDL statement per migration file to ensure atomicity.

## 3. Transactions & Data Integrity
- **Implementation:** `mysql2/promise` with manual `connection.beginTransaction()` and `connection.commit()`.
- **Observation:** The `checkout` module flawlessly uses transactions to ensure that an Order is created and Cart Items are cleared atomically. If one fails, `connection.rollback()` fires.
- **Audit Result:** ✅ Fully Implemented and Secure.

## 4. Soft Delete
- **Implementation:** `deleted_at` timestamp.
- **Observation:** Core entities (Users, Products) utilize soft deletes. However, the `WHERE deleted_at IS NULL` clause must be manually applied to every raw SQL read query.
- **Vulnerability:** Human error could lead to a developer writing `SELECT * FROM products` without filtering out deleted items, exposing inactive products to the storefront.
- **Audit Result:** 🟡 Partially Implemented. Requires a centralized query builder or strict repository reviews to enforce the `deleted_at` filter.

## 5. Indexes and Relations
- **Implementation:** BTree indexes applied to Foreign Keys.
- **Observation:** Compound indexes and unique constraints are utilized heavily (e.g., `user_id` + `product_id` on Wishlists).
- **Issue Detected:** MySQL strongly couples Foreign Keys to Indexes. Modifying an indexed column involved in an FK (like dropping a unique index on `variant_id` during the Phase 13.4 warehouse upgrade) requires manually dropping and recreating the Foreign Key.
- **Audit Result:** ✅ Implemented. The schema is highly normalized (3NF).

## 6. Security (SQL Injection)
- **Implementation:** Parameterized queries using `mysql2` placeholders (`?`).
- **Audit Result:** ✅ Fully Implemented. No string concatenation vulnerabilities found in the repositories.
