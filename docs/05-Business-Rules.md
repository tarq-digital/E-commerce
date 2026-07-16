# Business Rules - Weebster

This document defines the strict, non-negotiable business rules governing the Weebster e-commerce platform. These rules dictate how the system handles edge cases, protects revenue, and ensures a consistent customer experience. They must be enforced at the API layer (backend) regardless of frontend validation.

---

## 1. Inventory & Stock Rules
- **Rule 1.1: Stock Deduction Trigger:** Stock is strictly deducted *only* when a payment is successfully verified (Order transitions from `PENDING` to `PROCESSING`). Adding items to the cart or initiating checkout does *not* reserve or deduct stock.
- **Rule 1.2: Out of Stock Behavior:** If a product reaches 0 stock, it remains visible on the frontend but the "Add to Cart" button is disabled. It cannot be purchased.
- **Rule 1.3: Oversell Prevention (Race Condition):** During checkout, the database must use a transaction with a locking mechanism (or atomic decrement where `stock >= requested_quantity`) to ensure two users cannot buy the last item simultaneously.
- **Rule 1.4: Admin Stock Updates:** If an admin updates stock to 0 while a user has the item in their cart, the cart API must reject checkout validation and notify the user.

## 2. Order & Status Rules
- **Rule 2.1: Allowed State Transitions:**
  - `PENDING` -> `PROCESSING` (Payment successful)
  - `PENDING` -> `CANCELLED` (Payment failed / timeout)
  - `PROCESSING` -> `SHIPPED` (Admin action)
  - `SHIPPED` -> `DELIVERED` (Admin action)
  - `PROCESSING` -> `CANCELLED` (Admin action - Refund required)
- **Rule 2.2: Immutability:** Once an order reaches `PROCESSING` or beyond, the items, quantities, and totals on that order cannot be modified. Any changes require cancelling the order and creating a new one.
- **Rule 2.3: Order Identifiers:** Orders must be assigned a human-readable, unique identifier prefixed with `WB-` (e.g., `WB-100452`) rather than exposing raw database UUIDs or sequential IDs to the user.

## 3. Cart & Wishlist Rules
- **Rule 3.1: Guest vs Logged-In Cart:** 
  - Guest carts are stored locally.
  - When a guest logs in, the local cart is merged with their existing database cart. In case of conflicts (same item), the quantities are added (up to max stock limit).
- **Rule 3.2: Max Item Limit:** A user can add a maximum of 5 units of a single product to their cart (configurable in `constants`). This prevents wholesale hoarding.
- **Rule 3.3: Wishlist Privacy:** Wishlists are private to the user account. Unauthenticated users cannot create a wishlist.

## 4. Payment Rules (Razorpay)
- **Rule 4.1: Source of Truth:** The backend database is the ultimate source of truth, but Razorpay webhooks dictate payment success. The frontend success state must *never* be trusted to trigger order fulfillment.
- **Rule 4.2: Currency:** All transactions are processed strictly in Indian Rupees (INR).
- **Rule 4.3: Refunds:** Refunds are not automated in Version 1. If an admin cancels a `PROCESSING` order, the refund must be manually initiated from the Razorpay Dashboard.

## 5. User Account & Authentication Rules
- **Rule 5.1: Email Uniqueness:** A single email address can only be associated with one account.
- **Rule 5.2: Role Hierarchy:** 
  - `CUSTOMER`: Can read catalog, create orders, manage own profile.
  - `ADMIN`: Has full CRUD access to products, categories, orders, and user management.
- **Rule 5.3: Session Expiry:** Access tokens expire in 15 minutes. Refresh tokens expire in 7 days. If a refresh token is compromised, password reset or admin intervention must invalidate all active refresh tokens for that user.

## 6. Address Rules
- **Rule 6.1: Saved Addresses:** A user can save up to 10 addresses.
- **Rule 6.2: Address Modification Constraints:** Editing an address in the user's address book *does not* alter the shipping address on past or processing orders. Orders store a snapshot of the address at the time of purchase.
- **Rule 6.3: Required Fields:** Name, Address Line 1, City, State, Pincode, and Mobile Number are strictly required. Pincode must be exactly 6 digits. Mobile number must be exactly 10 digits.

## 7. Product & Category Rules
- **Rule 7.1: Category Deletion Constraints:** A category cannot be deleted if there are active products assigned to it. Products must be reassigned or deleted first.
- **Rule 7.2: Soft Deletes:** Products are never permanently deleted from the database. They are marked as `deletedAt = timestamp` (Soft Delete). This preserves historical order data integrity. Soft-deleted products are hidden from the frontend catalog.
- **Rule 7.3: Product URLs:** Product pages are accessed via slugs (e.g., `/product/iron-man-action-figure`). Slugs must be strictly unique across the database.

## 8. Pricing Rules
- **Rule 8.1: Precision:** All monetary values in the database are stored in the smallest currency unit (paise) as Integers (e.g., ₹500.00 is stored as `50000`) to prevent floating-point arithmetic errors.
- **Rule 8.2: Tax Inclusion:** All displayed prices are inclusive of GST, unless explicitly stated otherwise in the invoice generation.

---
*Compliance with these rules is mandatory for QA sign-off before production deployment.*
