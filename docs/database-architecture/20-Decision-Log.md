# Decision Log (Database Architecture)

This document records the major architectural decisions made during Phase 4, providing the rationale for *why* specific database structures were chosen.

---

### Decision 1: Relational Database (MySQL) over NoSQL (MongoDB)
- **Decision:** The core platform will use MySQL 8.0+.
- **Reason:** E-commerce data is highly relational. A product has variants; variants have inventory; orders contain variants. NoSQL document stores require massive denormalization and manual application-level joins, leading to data inconsistency in financial applications.
- **Alternatives:** MongoDB, Firebase.
- **Tradeoffs:** Schema migrations are rigid and require careful planning compared to schema-less NoSQL.

### Decision 2: Separate Inventory Table
- **Decision:** Inventory tracking is isolated to its own table (`inventory`), rather than simply placing a `stock` column on the `variants` table.
- **Reason:** Separates read-heavy product data from write-heavy transactional inventory data. It also instantly allows for multi-warehouse tracking in the future.
- **Alternatives:** Adding `stock` to the `variants` table.
- **Tradeoffs:** Requires a `JOIN` to display stock on the storefront.

### Decision 3: Soft Deletes
- **Decision:** Critical tables (`users`, `products`, `orders`) use a `deleted_at` timestamp instead of physically deleting rows.
- **Reason:** Historical integrity. If an admin deletes a product, past orders containing that product must not break or crash the application.
- **Alternatives:** Hard deletes with `ON DELETE SET NULL`.
- **Tradeoffs:** Slower queries (every query needs `WHERE deleted_at IS NULL`). Larger database size over time.

### Decision 4: Order Snapshots
- **Decision:** The `order_items` table stores copies of `product_name_snap` and `price_at_purchase`.
- **Reason:** Ensures receipts are immutable. If the price of a toy increases tomorrow, the receipt from yesterday must not change.
- **Alternatives:** Relying strictly on foreign keys to calculate order totals on the fly.
- **Tradeoffs:** Minor data duplication.

### Decision 5: Integer Auto-Increment vs UUIDs
- **Decision:** Internal primary keys use `INT AUTO_INCREMENT`. Exposed identifiers (like Order Numbers) use generated strings/CUIDs.
- **Reason:** Integers are significantly faster for B-Tree indexing and `JOIN` performance than massive string UUIDs. However, exposing integer IDs in URLs (e.g., `/orders/5`) allows competitors to guess sales volume.
- **Alternatives:** Using UUIDv4 for primary keys everywhere.
- **Tradeoffs:** Two IDs per order (the internal integer `id` and the external `order_number`).
