# Entity Documentation - Weebster

This document details the purpose, business rules, and lifecycle of every conceptual entity in the Weebster database.

---

## 1. Identity Entities

### `users`
- **Purpose:** Represents all human actors interacting with the system (Customers and Admins).
- **Business Rules:** Email must be unique. Passwords must be hashed using bcrypt/Argon2.
- **Lifecycle:** Created on registration. Never hard-deleted (soft delete only to preserve order history links).
- **Future:** Will eventually link to a `loyalty_points` entity.

### `addresses`
- **Purpose:** Stores physical locations for shipping and billing.
- **Business Rules:** A user can have up to 10 addresses. One must be marked `is_default`.
- **Lifecycle:** Created by users in dashboard or during checkout.

## 2. Catalog Entities

### `categories`
- **Purpose:** Hierarchical taxonomy for products.
- **Business Rules:** Supports self-referencing relationships (`parent_id`) for sub-categories. Must have a unique `slug`.
- **Lifecycle:** Created by Admins. Deleting a category cascades to subcategories but sets `category_id` to NULL on products to prevent accidental catalog wiping.

### `products`
- **Purpose:** The core entity for sale. Represents the base item (e.g., "Spider-Man Action Figure").
- **Business Rules:** Must have a unique `slug` for SEO URLs. Must belong to a category.
- **Lifecycle:** Soft deleted (`deleted_at`) if permanently removed. Toggled via `is_active` for temporary hiding.

### `product_images`
- **Purpose:** Stores URLs pointing to Cloudinary assets.
- **Business Rules:** One image per product must have `is_primary = true`. Ordered by `display_order`.

### `variants`
- **Purpose:** Represents the specific purchasable iteration of a product (e.g., if a toy has colors "Red" and "Blue", those are variants). If a product has no variations, it still has ONE default variant.
- **Business Rules:** Must have a unique `sku` (Stock Keeping Unit).
- **Lifecycle:** Cannot be deleted if associated with a past order.

### `inventory`
- **Purpose:** Tracks physical stock counts for a specific variant.
- **Business Rules:** `quantity_available` cannot drop below 0. `quantity_reserved` tracks items currently sitting in active carts to prevent overselling.
- **Future:** `warehouse_id` will support multiple locations (Store 1, Store 2, Main Warehouse).

## 3. Commerce Entities

### `orders`
- **Purpose:** The financial contract of a purchase.
- **Business Rules:** `order_number` must be a non-sequential unique string (e.g., `ORD-X98V2`). Must store a JSON snapshot of the shipping address to freeze it in time.
- **Lifecycle:** PENDING -> PROCESSING (paid) -> SHIPPED -> DELIVERED.

### `order_items`
- **Purpose:** The specific items purchased in an order.
- **Business Rules:** Must snapshot `price_at_purchase` and `product_name`.

### `payments`
- **Purpose:** Tracks the transaction with the payment gateway (Razorpay).
- **Business Rules:** 1:1 relationship with `orders`. Stores the `provider_payment_id` for refund processing.

### `coupons`
- **Purpose:** Discount codes.
- **Business Rules:** Can be flat rate or percentage. Enforces `max_uses` and `expiry_date`.

## 4. Engagement Entities

### `wishlists`
- **Purpose:** Tracks user interest for future purchase or marketing retargeting.
- **Business Rules:** Composite unique key on `(user_id, product_id)`.

### `reviews`
- **Purpose:** Customer feedback.
- **Business Rules:** `rating` strictly between 1 and 5. `is_approved` defaults to false to allow Admin moderation before public display.

## 5. System Entities

### `settings`
- **Purpose:** Key-value store for global store configurations (e.g., "Free Shipping Threshold", "Store Contact Email").
- **Business Rules:** Accessible only by Admins.

### `audit_logs` (Future/Implementation Detail)
- **Purpose:** Security trail for Admin actions.
- **Business Rules:** Stores `admin_id`, `action` ("UPDATED_PRICE"), `entity_id` ("PROD_12"), and `timestamp`. Immutable.
