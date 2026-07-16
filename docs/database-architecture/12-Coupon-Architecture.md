# Coupon Architecture - Weebster

Discounts require complex validation to prevent margin loss. The coupon architecture provides a flexible rules engine.

---

## 1. Coupons Table Schema

| Column | Description |
|--------|-------------|
| `code` | `VARCHAR(20) UNIQUE`. The text entered by the user (e.g., `WEEBSTER10`). |
| `discount_type` | `ENUM('PERCENTAGE', 'FIXED')`. |
| `discount_value` | Decimal. (e.g., `10.00` = 10% or ₹10). |
| `min_order_value`| Minimum cart total required to activate. |
| `max_discount` | Capping for percentage discounts (e.g., "10% off up to ₹500"). |
| `usage_limit` | Total number of times this coupon can be used globally (e.g., "First 100 users"). |
| `used_count` | Tracks global usage. |
| `expiry_date` | `DATETIME`. Coupon becomes invalid after this date. |
| `is_active` | Admin override toggle. |

## 2. Validation Logic (Backend Enforcement)
The database schema forces the application to evaluate rules before applying a discount.
- **Rule 1 (Time):** `expiry_date > NOW()` AND `is_active = TRUE`.
- **Rule 2 (Value):** Cart Subtotal > `min_order_value`.
- **Rule 3 (Limit):** `used_count < usage_limit`.

## 3. Order Tracking (Auditability)
When a coupon is successfully applied and the order is paid:
1. `UPDATE coupons SET used_count = used_count + 1 WHERE code = ?;`
2. The `orders` table has an optional `coupon_code` column storing the exact code used, and `discount_total` stores the amount saved.

## 4. Future Expansion (V2)
The current architecture supports basic store-wide discounts. Future additions will require schema modifications:
- **`coupon_user_usage` Table:** To enforce "One use per user", a junction table tracking `coupon_id` and `user_id` will be created.
- **Product Specific Coupons:** A `coupon_products` junction table to restrict a code to specific categories or products (e.g., "10% off Marvel only").
