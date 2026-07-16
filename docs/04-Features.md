# Feature Architecture - Weebster

This document details the exact technical and business behavior for every core feature in the Weebster platform Version 1. It bridges the gap between user requirements and technical implementation.

---

## 1. Authentication & Session Management

- **Purpose:** Securely identify users, protect customer data, and allow for order tracking and wishlist management.
- **Business Logic:** Users must verify identity to access dashboards or checkout faster. Guest checkout is permitted, but encouraged to register post-purchase.
- **User Flow:**
  1. User clicks "Login/Register".
  2. Submits email and password.
  3. Receives success toast and is redirected to previous page or dashboard.
- **Frontend Behaviour:** 
  - Validates email format and password strength (min 8 chars) on blur.
  - On submit, shows loading spinner on button.
  - On success, stores access token in memory (React Context/Zustand) and triggers UI state change (Navbar updates).
- **Backend Behaviour:**
  - Validates payload using Zod.
  - Hashes password using `bcrypt` (salt rounds: 12).
  - Generates short-lived Access Token (15m) and long-lived Refresh Token (7d).
  - Sets Refresh Token as a secure, `HttpOnly`, `SameSite=Strict` cookie.
- **Validation:** Email standard format. Password min 8 chars, 1 number, 1 uppercase.
- **Dependencies:** `bcrypt`, `jsonwebtoken`, `zod` (backend), `react-hook-form` (frontend).
- **Edge Cases:** 
  - Token expires during a checkout session (Frontend must silently intercept 401s and call the refresh endpoint, then retry the request).
  - User tries to register with an existing email (Return generic "Email already in use" message).
- **Future Expansion:** OAuth2 integration (Google, Apple Sign-in), OTP-based mobile login.

---

## 2. Cart Management

- **Purpose:** Allow users to accumulate products before purchasing.
- **Business Logic:** Cart is strictly validated against current database stock before proceeding to checkout.
- **User Flow:**
  1. User clicks "Add to Cart" on a product.
  2. Cart slide-out drawer opens automatically.
  3. User can increment/decrement quantities or remove items.
- **Frontend Behaviour:**
  - Optimistic UI updates: Quantity changes reflect instantly while API call happens in the background.
  - Cart state is maintained globally.
- **Backend Behaviour:**
  - For guests: Handled entirely on the frontend via `localStorage`.
  - For logged-in users: Cart state is synced to the database (`carts` and `cart_items` tables) to persist across devices.
  - Endpoints: `POST /cart`, `PUT /cart/:itemId`, `DELETE /cart/:itemId`.
- **Validation:** Requested quantity cannot exceed `Product.stock`.
- **Dependencies:** React Context / Zustand for global state.
- **Edge Cases:**
  - User adds item to cart, leaves site, comes back 2 days later, and item is out of stock. (Cart must fetch fresh stock on open and flag unavailable items, preventing checkout).
  - Guest user logs in (Frontend must merge `localStorage` cart with database cart).
- **Future Expansion:** Abandoned cart email triggers, reserved inventory (locking stock for 10 mins).

---

## 3. Checkout & Payment Processing

- **Purpose:** Collect shipping data and capture revenue securely.
- **Business Logic:** Payment processing is handled entirely by Razorpay. Orders are not marked "Confirmed" until Razorpay webhook validates the signature.
- **User Flow:**
  1. User proceeds from Cart to Checkout.
  2. Selects/Enters shipping address.
  3. Clicks "Pay Now".
  4. Razorpay modal opens. User completes payment.
  5. Redirected to Order Success page.
- **Frontend Behaviour:**
  - Single-page checkout flow.
  - Address forms auto-fill if user has saved addresses.
  - Integrates Razorpay standard checkout script (`window.Razorpay`).
- **Backend Behaviour:**
  - **Step 1:** Create an Order in database with status `PENDING`.
  - **Step 2:** Call Razorpay API to create an order instance and return `razorpay_order_id` to frontend.
  - **Step 3 (Webhook):** Receive `payment.captured` webhook from Razorpay, verify `x-razorpay-signature` using crypto HMAC-SHA256.
  - **Step 4:** Update DB Order status to `PROCESSING` and deduct stock.
- **Validation:** Address fields (Pincode must be valid Indian format), Phone number (10 digits).
- **Dependencies:** `razorpay` node SDK, crypto (for webhook validation).
- **Edge Cases:**
  - User closes browser during Razorpay modal (Order remains `PENDING` in DB, stock is not deducted).
  - Webhook fails or is delayed (Implement manual "Verify Payment" polling on the success page as fallback).
- **Future Expansion:** Multiple payment gateways (Stripe), EMI options, Cash on Delivery (COD) based on pincode serviceability.

---

## 4. Product Browsing & Filtering

- **Purpose:** Enable discovery of products within a scalable catalog.
- **Business Logic:** Products can belong to multiple categories. Filtering happens at the database level, not client side, to support 10,000+ items.
- **User Flow:** User selects category -> Applies Price filter -> Sorts by "Newest".
- **Frontend Behaviour:**
  - URL updates automatically with query parameters (e.g., `?category=action-figures&sort=newest`) to allow sharing filtered links.
  - Uses SWR or React Query to fetch data without full page reloads.
- **Backend Behaviour:**
  - `GET /products` endpoint parses query params.
  - Implements Prisma `where`, `orderBy`, `skip`, and `take` for filtering and cursor-based pagination.
- **Validation:** Query parameters must be sanitized to prevent NoSQL/SQL injection patterns.
- **Dependencies:** Prisma Client.
- **Edge Cases:** User enters invalid page number (e.g., `?page=9999`) -> Return empty array or redirect to page 1.
- **Future Expansion:** Elasticsearch integration for typo-tolerant search and advanced faceting.

---

## 5. Order Management (Admin)

- **Purpose:** Allow store staff to fulfill customer orders.
- **Business Logic:** Orders flow through specific states: `PENDING` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`. Only certain transitions are allowed.
- **User Flow:**
  1. Admin logs in to dashboard.
  2. Navigates to Orders.
  3. Selects a `PROCESSING` order, inputs a tracking number, and changes status to `SHIPPED`.
- **Frontend Behaviour:** Admin data table with bulk actions and status dropdowns.
- **Backend Behaviour:** 
  - Validates state machine (Cannot change `DELIVERED` to `PENDING`).
  - Emits internal events or sends emails (future) when status changes.
- **Validation:** Admin role required (JWT payload must contain `role: 'ADMIN'`).
- **Dependencies:** Role-based access control (RBAC) middleware.
- **Edge Cases:** Partial cancellations (Handled via manual refund in Razorpay dashboard for V1; status marked as `CANCELLED`).
- **Future Expansion:** automated shipping partner integration (e.g., Shiprocket) for auto-status updates.

---

## 6. Wishlist

- **Purpose:** Allow users to save items for future purchase.
- **Business Logic:** Requires a logged-in user. Guests clicking wishlist are prompted to login.
- **User Flow:** Click heart icon on product -> Icon turns solid red -> Toast confirms addition.
- **Frontend Behaviour:** Optimistic UI update on the heart icon.
- **Backend Behaviour:** 
  - Toggle endpoint: `POST /wishlist/toggle` - adds if missing, removes if exists.
- **Validation:** Product ID must exist.
- **Dependencies:** None.
- **Edge Cases:** Item in wishlist is deleted from catalog by admin (Query must cleanly ignore or automatically purge invalid wishlist entries).
- **Future Expansion:** Shareable wishlist links, price-drop email notifications.
