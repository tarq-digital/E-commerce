# Relationship Architecture - Weebster

This document dictates how tables interact with one another, specifically focusing on referential integrity, cascading rules, and deletion strategies.

---

## 1. Relationship Types

### One-to-One (1:1)
- **`orders` -> `payments`:** An order has exactly one payment record. The foreign key `order_id` exists on the `payments` table and is marked as `UNIQUE`.
- **`variants` -> `inventory`:** (Current V1 Implementation). A variant has exactly one inventory record (Warehouse 1).

### One-to-Many (1:N)
The most common relationship type.
- **`users` -> `orders`:** A user can place many orders.
- **`products` -> `variants`:** A product can have many variants (colors, sizes).
- **`categories` -> `products`:** A category contains many products.

### Many-to-Many (N:M)
Requires a Junction (Pivot) table.
- **`users` <-> `products` (Wishlist):** A user can wishlist many products, and a product can be wishlisted by many users. 
  - **Junction Table:** `wishlists` (columns: `user_id`, `product_id`).

## 2. Cascade Rules

Cascading rules define what happens to child rows when a parent row is deleted. We are extremely conservative with `ON DELETE CASCADE`.

| Parent Table | Child Table | On Delete Action | Rationale |
|--------------|-------------|------------------|-----------|
| `products` | `variants` | `CASCADE` | If a product is truly hard-deleted (rare), its variants are useless. |
| `variants` | `inventory` | `CASCADE` | If a variant is deleted, its physical stock tracking is irrelevant. |
| `users` | `addresses` | `CASCADE` | If a user deletes their account (GDPR), their PII addresses must be wiped. |
| `users` | `orders` | `SET NULL` | **CRITICAL:** If a user is deleted, their orders MUST REMAIN for financial auditing. The `user_id` on the order becomes `NULL`. |
| `categories` | `products` | `SET NULL` | If a category is deleted, the products just become uncategorized. Do not delete the products. |
| `orders` | `order_items` | `CASCADE` | An order item cannot exist without an order. |

## 3. Deletion Strategies

### Soft Deletion (`deleted_at` timestamp)
- Applied to: `users`, `products`.
- **How it works:** When an admin deletes a product, `UPDATE products SET deleted_at = NOW() WHERE id = ?`.
- **Application Logic:** Every `SELECT` query in Prisma must automatically append `WHERE deleted_at IS NULL`.
- **Restore Strategy:** `UPDATE products SET deleted_at = NULL`.

### Hard Deletion (`DELETE FROM`)
- Applied to: `wishlists`, `sessions`, `cart_items` (future).
- **How it works:** Ephemeral or strictly relational data is wiped entirely from the disk.

## 4. Update Strategy (`ON UPDATE`)
- We standardize on `ON UPDATE CASCADE` for all foreign keys. If a primary key changes (highly unlikely since we use `AUTO_INCREMENT`), the child tables will automatically update.
