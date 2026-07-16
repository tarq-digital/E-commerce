# Future Expansion Architecture - Weebster

This document details how the IA is designed to support future business roadmap items without requiring a complete rewrite or structural overhaul.

---

## 1. Multi-Language & Multi-Region Support
- **Current Architecture:** All routes are at the root (e.g., `/shop`).
- **Future Integration:** Next.js i18n routing can wrap the current structure without changing it.
  - Indian users: `weebster.in/hi/shop` (Hindi), `weebster.in/en/shop` (English).
  - International Expansion: `weebster.com/us/en/shop`.
  - **IA Impact:** The Navigation System will simply gain a Language/Region selector dropdown in the Top Header.

## 2. Content Marketing (Blog / Articles)
- **Current Architecture:** Static pages exist at `/about`, `/contact`.
- **Future Integration:** A new route group `(blog)` is added.
  - Routes: `/blog` (Index), `/blog/[article-slug]`.
  - **IA Impact:** The Blog becomes a primary link in the Header and Footer. Product pages gain a "Related Articles" section at the bottom to drive cross-traffic.

## 3. Loyalty & Rewards Program
- **Current Architecture:** The User Dashboard holds `/dashboard/orders` and `/dashboard/addresses`.
- **Future Integration:** Add `/dashboard/rewards`.
  - **IA Impact:** The Cart Drawer and Checkout Flow will gain a small API call to check if the user has points. If yes, a new UI block "Apply 500 Points (₹50 off)" slides into the Order Summary column.

## 4. Multi-Vendor Marketplace
- **Current Architecture:** Products are sold entirely by Weebster.
- **Future Integration:** The database schema already requires a `vendor_id`. 
  - **Admin Impact:** The `/admin` dashboard will implement a super-admin switch. Vendors log into the same `/admin` portal, but the Permission Matrix restricts them to only see their own products.
  - **Customer Impact:** Product pages gain a "Sold by [Vendor]" badge. Filter architecture gains a "Vendor" facet.

## 5. Mobile App (React Native)
- **Current Architecture:** The web app is mobile-first, but relies on standard HTTP routing.
- **Future Integration:** The Node.js Express backend currently handles API calls for the Next.js frontend. To support a mobile app, the API routes remain completely unchanged. The mobile app simply consumes the exact same `/api/v1/products` endpoints.
  - **IA Impact:** The Mobile App IA will perfectly mirror the Mobile Web IA (Bottom Tabs for Home, Search, Categories, Cart, Profile), ensuring a unified brand experience.

## 6. Subscriptions (e.g., "Toy of the Month Box")
- **Current Architecture:** Standard single-purchase checkout flow.
- **Future Integration:** 
  - Product Schema gains an `is_subscription` boolean.
  - **IA Impact:** If a subscription item is in the Cart, the Razorpay integration flow diverts from standard payment to Razorpay Subscriptions (e-Mandate) during the Checkout Flow. The `/dashboard` gains a `/dashboard/subscriptions` tab for users to cancel/pause deliveries.
