# Performance Architecture - Weebster

This document details how the database handles high read/write loads to maintain sub-50ms query times.

---

## 1. Pagination Strategy
E-commerce queries (e.g., viewing orders, browsing products) must never return unbounded datasets.

### Offset Pagination (Admin Dashboard)
- **SQL:** `LIMIT 20 OFFSET 40`
- **Use Case:** Tables and datagrids where users need to jump to a specific page (e.g., Page 3).
- **Tradeoff:** As OFFSET grows (e.g., `OFFSET 100000`), the database still has to scan and discard 100,000 rows, leading to performance degradation. Acceptable for Admin panels, unacceptable for public APIs.

### Cursor Pagination (Customer Storefront)
- **SQL:** `WHERE id > last_seen_id LIMIT 20`
- **Use Case:** Infinite scrolling, Mobile Apps, or "Load More" buttons.
- **Benefit:** Requires an index on the cursor column. Performs consistently in `O(1)` time regardless of how deep the user scrolls because it leverages the B-Tree index directly.

## 2. Caching Readiness (Application Layer)
The database shouldn't handle every request if the data is static.

- **V1 (Next.js Cache):** The Next.js App Router utilizes massive aggressive caching. The database query for `/category/action-figures` only hits MySQL once during the build or revalidation period. Next.js serves the cached HTML/JSON to all subsequent users.
- **V2 (Redis):** If moving to a more dynamic frontend, a Redis layer will sit in front of MySQL. Heavy `SELECT` queries (like calculating the Mega Menu hierarchy) will be cached in Redis with a 1-hour TTL.

## 3. Query Optimization & Joins
- **N+1 Problem:** Avoid fetching a list of orders, then looping through that list to fetch the user for each order (101 queries).
- **Solution:** Always use Prisma's `include` feature to perform `JOIN`s at the database level.
  ```javascript
  // Good: 1 query using a JOIN
  prisma.order.findMany({ include: { user: true } })
  ```
- **Join Limits:** Avoid joining more than 4 tables in a single query for customer-facing APIs. If a UI requires massive joined data, consider denormalizing or creating a dedicated View.

## 4. Connection Pooling
Node.js is single-threaded, but it can open many concurrent connections to the database.
- **PgBouncer / Prisma Accelerate:** If deploying Serverless functions (Vercel) connecting to a persistent database (Hostinger VPS), connection exhaustion will crash the database. We MUST implement connection pooling (e.g., configuring the Prisma connection URL with `?connection_limit=10`).

## 5. Future Sharding & Replicas
- **Read Replicas:** If read traffic overwhelms the primary VPS, we will provision a secondary MySQL instance specifically for handling `SELECT` queries from the storefront, while routing all `INSERT/UPDATE` queries (Checkout, Admin) to the primary node.
- **Sharding:** Splitting the database across multiple servers. Highly unlikely to be needed until Weebster reaches Amazon-level scale.
