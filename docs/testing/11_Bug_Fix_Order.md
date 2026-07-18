# 11 Bug Fix Order

## Priority 1: Critical (Security & Data Integrity)
These bugs compromise the platform and must be fixed immediately during Phase 4:
1. **Analytics Token Exposure (Security)** - Implement HttpOnly cookies and Axios interceptors.
2. **Product Soft-Delete Leak (Data)** - Enforce global SQL soft-delete filters.
3. **Checkout Validation Bypass (Data)** - Apply Zod middleware to all POST endpoints.

## Priority 2: High (Broken Core Workflows)
4. **Forgot Password Crash (Auth)** - Create DB migration and connect Nodemailer.
5. **Missing Wishlist APIs (Feature)** - Wire the `wishlist` routes in Express.

## Priority 3: Medium (UX and Edge Cases)
6. **Cart Drawer Hydration (UX)** - Add `useEffect` wrapper around `localStorage` interactions.
7. **CRM Notes UI (Feature)** - Build the missing React component in the Admin CRM panel.
