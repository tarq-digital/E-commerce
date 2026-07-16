# Order Architecture - Weebster

Orders are immutable financial contracts. The database schema enforces strict immutability by snapshotting data at the exact moment of purchase.

---

## 1. Immutability (The Snapshot Strategy)

**The Problem:** If an order links to `product_id = 5` (which costs ₹1000 today), and tomorrow the Admin raises the price to ₹1200, the user's historical order receipt will incorrectly display ₹1200.
**The Solution:** Denormalization via Snapshots.

### `order_items` Table
- `price_at_purchase` (DECIMAL): Copies the variant's price exactly as it was.
- `product_name_snap` (VARCHAR): Copies the product name (e.g., "Iron Man Figure").
- `sku_snapshot` (VARCHAR): Copies the exact SKU.
- `variant_id` (FK): Maintained for linking, but configured with `ON DELETE SET NULL`. If the product is deleted, the receipt survives via the snapshots.

### `orders` Table
- `shipping_snapshot` (JSON): Copies the exact address used. If the user later updates their profile address, this order's shipping destination remains unchanged.

## 2. Order Lifecycle (Status ENUM)

The `status` column dictates the business logic permitted on the order.

1. **`PENDING`:** Created when the user clicks "Checkout". Inventory is reserved. Awaiting Razorpay success.
2. **`PROCESSING`:** Payment verified. Warehouse team needs to pack the box.
3. **`SHIPPED`:** Box given to courier. Generates an email to the customer with a tracking number (stored in an optional `tracking_url` column).
4. **`DELIVERED`:** End of successful lifecycle. Triggers a request for a review.
5. **`CANCELLED`:** Order abandoned or cancelled by user/admin before shipping. Returns inventory.
6. **`REFUNDED`:** Post-payment cancellation. Handled differently than `CANCELLED` because it involves financial reversal via Razorpay APIs.

## 3. Financial Calculation Rules
Calculations are stored explicitly on the `orders` table to avoid expensive on-the-fly math.
- `subtotal`: Sum of (`order_items.price_at_purchase` * `quantity`).
- `shipping_fee`: Flat rate or calculated.
- `discount_total`: Amount subtracted via coupons.
- **`grand_total`:** `(subtotal + shipping_fee) - discount_total`. This is the exact integer/decimal sent to Razorpay.

## 4. Guest Checkout Support
- `orders.user_id` is `NULLABLE`.
- If an order is placed by a guest, `orders.contact_email` and `orders.contact_phone` store the identity for receipt delivery. If that guest later registers an account with that email, a background script can retroactively link the order by updating `user_id`.
