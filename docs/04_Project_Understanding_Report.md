# 04 Project Understanding Report

## 1. Overall Vision
Weebster is a premium e-commerce platform designed to bridge the gap between high-end offline retail and an elegant digital storefront. Beyond serving a single client, its architecture acts as a highly scalable, reusable enterprise boilerplate for future e-commerce deployments.

## 2. Technology Stack
- **Frontend:** Next.js (App Router), React, Zustand/Context, Tailwind/CSS Modules.
- **Backend:** Node.js, Express.js, Custom SQL Migration Engine.
- **Database:** MySQL (managed via raw SQL `mysql2/promise`, with strict normalization).
- **Integrations:** Razorpay (Payments), Cloudinary (Media Assets).

## 3. Core Workflows

### 3.1 Authentication Flow
- Users register/login securely. The backend hashes passwords with `bcrypt`.
- A JWT Access Token is issued and stored (expected in memory, currently handled via cookies/local storage in implementation).
- A long-lived Refresh Token is managed via HttpOnly cookies to defend against XSS.

### 3.2 Catalog & Inventory Flow
- The catalog organizes items hierarchically: Categories -> Products.
- Inventory is tracked strictly at the `products` (and `warehouse_inventory` post-Phase 13.4) level.
- Stock is only decremented upon successful payment capture (via Webhooks), preventing cart abandonment from locking up inventory indefinitely.

### 3.3 Cart & Checkout Flow
- Cart is synced across sessions for authenticated users, but functions seamlessly via local storage for guests (`x-guest-cart-token`).
- Checkout relies on a single-page flow, collecting shipping snapshots to preserve historical integrity.
- Orders initialize in a `PENDING` state until Razorpay confirms the transaction via webhook, shifting the state to `CONFIRMED` or `PROCESSING`.

### 3.4 Admin & Backoffice Flow
- The Administration Suite (Phase 13) provides a unified dashboard for catalog, order, and customer management.
- **Order Operations:** Supports sophisticated state machine transitions (`SHIPPED`, `DELIVERED`, `CANCELLED`).
- **Settings & Media:** A centralized `SettingsService` and `MediaService` manage global configurations and Cloudinary assets, ensuring no hardcoded dependencies exist in the UI.

## 4. Current Project State
The platform has successfully reached the conclusion of **Phase 13.9**. The storefront is operational with full checkout flows, and the Enterprise Administration Suite is complete, allowing absolute operational control over inventory, media, and platform configurations.

## 5. Conclusion
The implementation is incredibly robust, particularly in its backend layered architecture and database normalization. However, the documentation (specifically regarding ORM usage and primary key structures) must be updated to align with the highly performant raw SQL path the engineering team ultimately took.
