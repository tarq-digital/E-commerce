# Database Design - Weebster

This document outlines the MySQL database schema, designed to be managed and queried using Prisma ORM. The architecture follows normalization best practices, ensuring data integrity while allowing for horizontal and vertical scaling.

---

## 1. Database Philosophy
- **RDBMS Choice:** MySQL is chosen for its strict ACID compliance, ensuring reliability in transactional data (e.g., payments and inventory).
- **ORM Choice:** Prisma provides safe queries and automated schema migrations, perfectly aligning with our JavaScript backend.
- **Naming Conventions:** 
  - Tables: `snake_case`, pluralized (e.g., `users`, `order_items`).
  - Columns: `snake_case` (e.g., `first_name`, `created_at`).
  - Foreign Keys: Suffixed with `_id` (e.g., `user_id`).
- **Timestamps:** Every table includes `created_at` and `updated_at` timestamps.
- **Soft Deletes:** Core business entities (Products, Users) use a `deleted_at` nullable timestamp column instead of hard deletion.

## 2. Core Entities & Schema

### `users`
Stores all authentication and profile data.
- `id` (String, UUID, Primary Key)
- `first_name` (String, 100)
- `last_name` (String, 100)
- `email` (String, 255, Unique, Index)
- `password_hash` (String, 255)
- `role` (Enum: `CUSTOMER`, `ADMIN`, Default: `CUSTOMER`)
- `refresh_token` (String, Nullable)
- `created_at` (DateTime)
- `updated_at` (DateTime)
- `deleted_at` (DateTime, Nullable)

### `addresses`
Stores user shipping addresses. A user can have multiple addresses.
- `id` (String, UUID, Primary Key)
- `user_id` (String, UUID, Foreign Key -> `users.id`, Index)
- `full_name` (String, 150)
- `address_line_1` (String, 255)
- `address_line_2` (String, 255, Nullable)
- `city` (String, 100)
- `state` (String, 100)
- `pincode` (String, 10)
- `phone` (String, 20)
- `is_default` (Boolean, Default: false)
- `created_at`, `updated_at`

### `categories`
Defines product grouping (e.g., Action Figures, Educational).
- `id` (String, UUID, Primary Key)
- `name` (String, 100, Unique)
- `slug` (String, 100, Unique, Index)
- `description` (Text, Nullable)
- `image_url` (String, 255, Nullable)
- `created_at`, `updated_at`

### `products`
The core catalog table.
- `id` (String, UUID, Primary Key)
- `category_id` (String, UUID, Foreign Key -> `categories.id`, Index)
- `title` (String, 255)
- `slug` (String, 255, Unique, Index)
- `description` (Text)
- `price` (Int, stored in paise, e.g., 50000 = ₹500.00)
- `compare_at_price` (Int, Nullable, for showing discounts)
- `stock` (Int, Default: 0)
- `sku` (String, 100, Unique, Index)
- `images` (JSON, array of Cloudinary URLs)
- `is_active` (Boolean, Default: true)
- `created_at`, `updated_at`
- `deleted_at` (DateTime, Nullable)

### `orders`
Represents a customer's purchase intent and final transaction.
- `id` (String, UUID, Primary Key)
- `order_number` (String, 50, Unique, Index) -- e.g., "WB-100452"
- `user_id` (String, UUID, Nullable for Guest, Foreign Key -> `users.id`)
- `status` (Enum: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
- `total_amount` (Int)
- `shipping_address` (JSON, Snapshot of address at time of order)
- `razorpay_order_id` (String, 255, Unique, Nullable)
- `razorpay_payment_id` (String, 255, Unique, Nullable)
- `created_at`, `updated_at`

### `order_items`
Links products to orders to handle quantity and historical pricing.
- `id` (String, UUID, Primary Key)
- `order_id` (String, UUID, Foreign Key -> `orders.id`, Index)
- `product_id` (String, UUID, Foreign Key -> `products.id`)
- `product_title` (String, 255, Snapshot of title)
- `quantity` (Int)
- `price_at_purchase` (Int, Snapshot of price to prevent historical changes if product price changes later)
- `created_at`, `updated_at`

### `carts` & `cart_items`
Persistent carts for logged-in users.
**`carts`**
- `id` (String, UUID, Primary Key)
- `user_id` (String, UUID, Unique, Foreign Key -> `users.id`)
- `updated_at`

**`cart_items`**
- `id` (String, UUID, Primary Key)
- `cart_id` (String, UUID, Foreign Key -> `carts.id`, Index)
- `product_id` (String, UUID, Foreign Key -> `products.id`)
- `quantity` (Int)

### `wishlists`
- `id` (String, UUID, Primary Key)
- `user_id` (String, UUID, Foreign Key -> `users.id`, Index)
- `product_id` (String, UUID, Foreign Key -> `products.id`, Index)
- `created_at`
- *Constraint:* Unique compound index on `[user_id, product_id]`.

## 3. Entity Relationships
- **User -> Addresses:** One-to-Many
- **User -> Orders:** One-to-Many
- **User -> Cart:** One-to-One
- **Category -> Products:** One-to-Many
- **Order -> OrderItems:** One-to-Many
- **Product -> OrderItems:** One-to-Many
- **Cart -> CartItems:** One-to-Many

## 4. Normalization Strategy
The database follows strict Third Normal Form (3NF). Data duplication is strictly avoided, except in explicit "Snapshot" scenarios required for e-commerce compliance:
- `orders.shipping_address`: Must be a JSON snapshot. If we linked to `addresses.id`, editing the address in the dashboard later would retroactively change historical order invoices, which is illegal.
- `order_items.price_at_purchase`: Must be a snapshot. If a product price increases tomorrow, past orders must reflect the price paid on that day.

## 5. Indexing Strategy
To ensure sub-100ms query times at scale, indexes (BTrees) are applied to:
- Primary Keys (Auto-indexed by MySQL)
- Foreign Keys (`user_id`, `category_id`)
- Frequently searched columns: `products.slug`, `products.sku`, `orders.order_number`, `users.email`.

## 6. Scalability & Future-Proofing
- **UUIDs vs Auto-Increment INT:** We use UUIDs for Primary Keys. This prevents URL enumerations (competitors guessing sales volume via sequential order IDs) and allows seamless database sharding or merging in the future.
- **Price Storage:** Storing prices as Integers (paise) prevents critical rounding errors inherent in SQL `FLOAT` or `DECIMAL` types across different runtime environments.
