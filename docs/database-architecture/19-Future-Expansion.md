# Future Expansion (Database) - Weebster

A rigid schema prevents business growth. This document outlines exactly how future roadmap features will be integrated into the existing architecture without breaking it.

---

## 1. Loyalty & Rewards Program
- **Integration:** 
  - Add `loyalty_points` (INT) to the `users` table.
  - Create `point_transactions` table (`id`, `user_id`, `amount`, `reason`, `order_id`) to maintain an audit trail of points earned/spent.
  - Update `orders` table to include `points_used` and `points_discount_value`.

## 2. Multiple Physical Stores / Warehouses
- **Integration:**
  - Create a `warehouses` table (`id`, `name`, `address`).
  - The existing `inventory` table already has a `warehouse_id` column. We simply insert new rows for the new location.
  - Update `orders` to include a `fulfillment_warehouse_id` to track which store shipped the item.

## 3. Multi-Vendor Marketplace
- **Integration:**
  - Create a `vendors` table (`id`, `name`, `contact_info`).
  - Add `vendor_id` to the `products` table.
  - Add `vendor_id` to the `order_items` table (crucial, because an order might contain items from multiple vendors, requiring split payouts).
  - Create a `vendor_payouts` table to track commission payments.

## 4. Multi-Language (i18n)
- **Integration:**
  - Do NOT add columns like `name_en`, `name_hi` to the `products` table (this breaks scaling).
  - Create a `product_translations` table (`id`, `product_id`, `language_code`, `name`, `description`).
  - Queries will `JOIN` the translation table based on the user's selected language, falling back to English if no translation exists.

## 5. Subscriptions / "Toy of the Month"
- **Integration:**
  - Add `is_subscription` (BOOLEAN) to `products`.
  - Create a `subscriptions` table (`id`, `user_id`, `product_id`, `status`, `next_billing_date`, `stripe_subscription_id`).
  - A background cron job queries the `subscriptions` table daily and generates new `orders` rows automatically.

## 6. Blog & Content Hub
- **Integration:**
  - Create `posts` table (`id`, `title`, `slug`, `content`, `author_id`, `published_at`).
  - Create `post_categories` table.
  - No modification to commerce tables required.

## 7. Digital Products / Gift Cards
- **Integration:**
  - Add `is_digital` (BOOLEAN) to `products` and `variants`.
  - Create `gift_cards` table (`id`, `code`, `balance`, `user_id`, `expiry_date`).
  - Modify checkout flow to skip the "Shipping Address" requirement if the cart only contains digital variants.
