# Page Inventory - Weebster

This document catalogs every unique page in the application, defining its purpose, interactions, and dependencies.

---

## 1. Customer Storefront

### 1.1 Home Page (`/`)
- **Purpose:** Brand introduction, marketing campaigns, and highest-level navigation.
- **Target User:** All users.
- **Entry Points:** Direct traffic, organic search, social links.
- **Exit Points:** Product pages, Category pages, Search.
- **Primary Actions:** Click Hero Banner, Click Category, Search.
- **Secondary Actions:** View Footer links.
- **SEO Importance:** **Critical.** Targets brand keywords.
- **Auth Requirement:** None.

### 1.2 Product Listing Page / Shop (`/shop`, `/category/:slug`)
- **Purpose:** Browse catalog, apply filters, and sort.
- **Target User:** Users exploring options or narrowing down specific requirements.
- **Entry Points:** Navigation menu, Home page grids.
- **Exit Points:** Product Details, Cart (via Quick Add).
- **Primary Actions:** Click Product, Filter, Sort.
- **Secondary Actions:** Add to Wishlist.
- **SEO Importance:** **High.** Targets broad keywords (e.g., "Buy Action Figures India").
- **Dependencies:** Elasticsearch / Prisma filtering logic.

### 1.3 Product Details Page (`/product/:slug`)
- **Purpose:** Drive conversion. Provide all information necessary to make a purchase decision.
- **Target User:** High-intent buyers.
- **Entry Points:** Catalog pages, Search, direct links.
- **Exit Points:** Cart Checkout, related products.
- **Primary Actions:** Add to Cart, Select Variant (if applicable).
- **Secondary Actions:** View gallery, Add to Wishlist, Read Specs.
- **SEO Importance:** **Critical.** Targets long-tail specific product keywords. Requires rich JSON-LD markup.
- **Dependencies:** Cloudinary (images).

### 1.4 Cart Drawer (Component Level, not a Page)
- **Purpose:** Review items before committing to checkout.
- **Target User:** Users with intent to purchase.
- **Primary Actions:** Proceed to Checkout.
- **Secondary Actions:** Adjust quantity, Remove item.

### 1.5 Checkout Page (`/checkout`)
- **Purpose:** Collect shipping data and process payment securely.
- **Target User:** Users ready to buy.
- **Entry Points:** Cart Drawer.
- **Exit Points:** Order Success Page (or abandonment).
- **Primary Actions:** Enter Address, Pay via Razorpay.
- **SEO Importance:** **None.** (Must be `noindex`).
- **Auth Requirement:** Guest allowed, but highly encourages login.
- **Dependencies:** Razorpay API.

### 1.6 Order Success Page (`/checkout/success`)
- **Purpose:** Confirm transaction and provide order tracking number.
- **Primary Actions:** View Order Details, Return Home.

## 2. User Dashboard

### 2.1 Login / Register (`/auth`)
- **Purpose:** Secure identity verification.
- **Primary Actions:** Submit credentials, Social Login (future).
- **SEO Importance:** **Low.**

### 2.2 Profile Overview (`/dashboard`)
- **Purpose:** Central hub for customer activity.
- **Target User:** Logged-in customers.
- **Primary Actions:** Navigate to Orders or Addresses.
- **Auth Requirement:** **Strictly Protected.**

### 2.3 Order History (`/dashboard/orders`)
- **Purpose:** Track current deliveries and view past purchases.
- **Primary Actions:** Click order for receipt/tracking details.

## 3. Admin Dashboard

### 3.1 Admin Overview (`/admin`)
- **Purpose:** High-level metrics for business owners.
- **Primary Actions:** View revenue trends, navigate to pending orders.
- **Auth Requirement:** **Strictly Protected (ADMIN Role).**

### 3.2 Product Management (`/admin/products`)
- **Purpose:** Catalog CRUD operations.
- **Primary Actions:** Create new product, Edit existing, Toggle active status.

### 3.3 Order Fulfillment (`/admin/orders`)
- **Purpose:** Process customer purchases.
- **Primary Actions:** Change order status (Processing -> Shipped).

## 4. Static Legal Pages
- **Pages:** `/about`, `/contact`, `/terms`, `/privacy`, `/shipping`
- **Purpose:** Build trust and comply with e-commerce regulations.
- **SEO Importance:** Medium. Required for Google Merchant Center approval.
