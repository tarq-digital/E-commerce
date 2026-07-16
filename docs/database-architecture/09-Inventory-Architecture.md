# Inventory Architecture - Weebster

Inventory management is the most critical area for preventing revenue loss (overselling) and customer dissatisfaction. Weebster uses an isolated inventory table specifically designed for high concurrency.

---

## 1. The Inventory Table

Instead of a single `stock` column on the `variants` table, we use a dedicated `inventory` table:
`id | variant_id | warehouse_id | qty_available | qty_reserved`

### Why Separate It?
- **Concurrency:** Inventory updates happen constantly during checkouts. If inventory was on the `products` table, updating stock would lock the product row, blocking users from simply reading the product description. Separating it reduces row-level locking contention.
- **Multi-Warehouse Readiness:** Adding a second physical store in the future simply requires inserting a new row with `warehouse_id = 2` for that variant. The `products` and `variants` tables do not need to change.

## 2. The Reservation System (`qty_reserved`)

To prevent the "I had it in my cart but it sold out" scenario, we use soft reservations.

### Workflow
1. User clicks "Proceed to Checkout".
2. **Transaction Start:**
   - DB runs: `UPDATE inventory SET qty_available = qty_available - 1, qty_reserved = qty_reserved + 1 WHERE variant_id = X AND qty_available > 0;`
   - If the update affects 0 rows (meaning stock is 0), the transaction aborts.
3. User completes Razorpay payment.
4. **Transaction Commit:**
   - DB runs: `UPDATE inventory SET qty_reserved = qty_reserved - 1 WHERE variant_id = X;` (The item is now permanently sold).
5. **Failure / Timeout (User Abandons Checkout):**
   - A cron job or background worker checks for abandoned `PENDING` orders after 15 minutes.
   - DB runs: `UPDATE inventory SET qty_available = qty_available + 1, qty_reserved = qty_reserved - 1 WHERE variant_id = X;` (Stock returns to the shelf).

## 3. Inventory Transactions (Future Audit Log)
*For V2 implementation.*
To track *who* adjusted stock and *why*, we will introduce an `inventory_transactions` table.
- `id | inventory_id | change_amount (+/-) | reason (PURCHASE, RETURN, ADMIN_ADJUST) | admin_id`
- This ensures absolute auditability if stock physically goes missing from the warehouse.

## 4. Low Stock Alerts
- The application will utilize a threshold (e.g., `< 5`) to trigger "Low Stock!" UI badges on the storefront.
- For backend alerts, a scheduled CRON job will query `SELECT variant_id FROM inventory WHERE qty_available <= 5` daily and email the store manager.
