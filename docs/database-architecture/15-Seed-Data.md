# Seed Data Architecture - Weebster

Seed data initializes a fresh database with the baseline state required for the application to function. It is split into strictly Required Data (Production) and Dummy Data (Development).

---

## 1. Production Seed (Required Data)
This script runs automatically when setting up a fresh production or staging environment. The application will crash or behave unpredictably without this data.

### Default Roles & Admins
- `users`: Inserts the root Super Admin account (credentials securely injected via Environment Variables during deployment).

### Default Categories (Taxonomy Foundation)
- `categories`: Inserts the root structural categories (e.g., Action Figures, Board Games, Collectibles). Ensures the navigation menu works on day 1.

### Global Settings
- `settings`: Inserts required KV pairs.
  - `shipping_flat_rate`: 100
  - `shipping_free_threshold`: 999
  - `store_contact_email`: 'support@weebster.in'

## 2. Development Seed (Dummy Data)
This script runs ONLY in local developer environments (`npx prisma db seed`) to populate the UI with realistic scenarios.

### Dummy Users
- 1 Admin (`admin@weebster.local`).
- 5 Customers with varied state (Some with addresses, some without).

### Dummy Products & Variants
- ~20 Products spanning various categories.
- Includes complex structures (e.g., A product with 3 variants, different price overrides).
- Includes edge-case data (e.g., A product with a very long title to test UI wrapping, a product with 0 inventory to test the "Out of Stock" button).

### Dummy Orders
- Simulates the entire lifecycle to allow frontend devs to test the dashboard.
- 1 `PENDING` order.
- 1 `PROCESSING` order.
- 1 `SHIPPED` order.
- 1 `DELIVERED` order (with associated dummy review).

## 3. Implementation Rules
- The seed script (`prisma/seed.ts`) must be completely idempotent. Using `upsert` instead of `create` ensures that running the seed command twice does not crash the database due to UNIQUE constraint violations.
