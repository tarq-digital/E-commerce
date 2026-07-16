# Indexing Strategy - Weebster

This document details the database indexing strategy to ensure read operations (especially searches and filtering) remain under 50ms even at 100,000+ rows.

---

## 1. Primary Indexes
- Automatically created by MySQL for every `PRIMARY KEY` (e.g., `id`). Clustered index. Extremely fast for exact lookups.

## 2. Foreign Key Indexes
- MySQL automatically indexes columns defined as `FOREIGN KEY` constraints.
- This ensures that `JOIN` operations (e.g., fetching a user's addresses) are instantaneous.

## 3. Unique Indexes
Enforces data integrity at the database level, preventing race conditions that application code might miss.
- `users.email`
- `categories.slug`
- `products.slug`
- `variants.sku`
- `orders.order_number`

## 4. Performance Indexes (Single Column)
Used for columns heavily queried in `WHERE` or `ORDER BY` clauses.
- **`products.is_active`:** The storefront catalog query always runs `WHERE is_active = true`. Indexing this speeds up the initial catalog load.
- **`orders.status`:** The Admin dashboard frequently filters by `WHERE status = 'PENDING'`.
- **`orders.created_at`:** Essential for generating revenue reports by date range (`WHERE created_at BETWEEN X AND Y`).

## 5. Composite Indexes
Used when queries frequently filter by multiple columns simultaneously.
- **`inventory (variant_id, warehouse_id)`:** Ensures fast lookup of a specific variant's stock at a specific location.
- **`wishlists (user_id, product_id)`:** Prevents duplicate wishlist entries AND speeds up the "is this product in my wishlist?" check on the Product Details page.

## 6. Search Indexes (Full-Text)
- **V1 (Current):** We apply a `FULLTEXT` index on `products.name` and `products.description`. This allows the use of `MATCH(name, description) AGAINST('spider-man' IN BOOLEAN MODE)` which is significantly faster and more powerful than standard `LIKE '%spider-man%'`.
- **V2 (Future):** As the catalog hits 10,000 items, we will offload search to an external engine (Elasticsearch or Typesense). The MySQL FULLTEXT index will be deprecated to save storage space and write performance.

## 7. Tradeoffs & Maintenance
- **Why not index every column?** Indexes speed up `SELECT` queries but slow down `INSERT`, `UPDATE`, and `DELETE` queries, because the index B-tree must be recalculated on every write. They also consume disk space.
- **Maintenance:** We will strictly only add non-unique indexes when a slow query is identified in production logs. We do not prematurely optimize.
