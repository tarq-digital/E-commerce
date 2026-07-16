# Constraints Architecture - Weebster

Database constraints are the final line of defense against bad data. Application-level validation (Zod/Joi) is required, but database constraints ensure absolute integrity even if the application logic fails or a script is run manually.

---

## 1. Domain Constraints (Data Types & Lengths)
- **`VARCHAR` limits:** E-commerce strings shouldn't be infinite. `users.first_name` is capped at `100`. `products.slug` is capped at `255`. If an attacker tries to submit a 1GB string to overflow memory, the database instantly rejects it.
- **`DECIMAL` over `FLOAT`:** All monetary values (`price`, `subtotal`) MUST use `DECIMAL(10,2)`. `FLOAT` and `DOUBLE` introduce floating-point math rounding errors which are unacceptable in financial systems.

## 2. Default Values
Ensures rows are initialized correctly if the application omits non-critical data.
- `users.role` defaults to `'CUSTOMER'`. (Security: Ensures a bug in the registration API doesn't accidentally create an Admin).
- `products.is_active` defaults to `TRUE`.
- `inventory.qty_available` defaults to `0`.

## 3. Check Constraints (`CHECK`)
Prevents illogical states that data types alone cannot catch.
- **Inventory Bounds:** `CHECK (quantity_available >= 0)` - It is physically impossible to have negative stock on a shelf. This constraint prevents race conditions from driving stock into the negatives.
- **Review Bounds:** `CHECK (rating >= 1 AND rating <= 5)` - Ensures a malicious API call cannot submit a 10-star or -5 star review.
- **Pricing Logic:** `CHECK (compare_price IS NULL OR compare_price > base_price)` - If a product is on sale, the original "compare" price must actually be higher than the current selling price. (Currently optional, but highly recommended for data cleanliness).

## 4. Nullability (`NOT NULL`)
We enforce strict nullability. If a field is required by the business logic, it must be `NOT NULL` in the database.
- `orders.grand_total` -> `NOT NULL`
- `addresses.street` -> `NOT NULL`

## 5. Unique Constraints
As defined in the Indexing Strategy, `UNIQUE` constraints prevent duplicates.
- **Idempotency Check:** If Razorpay sends a webhook for a payment twice (due to network retries), the `payments.provider_payment_id` column must be `UNIQUE`. The second insert will throw a database error, cleanly stopping the webhook processing from double-counting the payment.
