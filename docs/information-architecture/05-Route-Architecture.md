# Route Architecture - Weebster

This document defines the Next.js App Router structure. It establishes how URLs map to physical files and how the application handles authentication, layouts, and loading states at a structural level.

---

## 1. Route Groups
We use Next.js Route Groups `(folderName)` to organize routes without affecting the URL path. This allows us to share distinct Layouts (like Navbars) across related pages.

### A. Customer Storefront `(shop)`
All public-facing e-commerce pages. They share the standard Top Header and Footer layout.
- `src/app/(shop)/layout.tsx` -> Injects `<CustomerNavbar />` and `<Footer />`.
- Routes: `/`, `/shop`, `/product/[slug]`, `/category/[slug]`

### B. Authentication `(auth)`
Isolated flow for login and registration. Removes distractions like the main navbar.
- `src/app/(auth)/layout.tsx` -> Injects minimal `<AuthHeader />` (Logo only).
- Routes: `/login`, `/register`, `/forgot-password`

### C. Secure Checkout `(checkout)`
Strictly isolated checkout flow to maximize conversion.
- `src/app/(checkout)/layout.tsx` -> Injects `<CheckoutHeader />` (Logo + Trust Badges).
- Routes: `/checkout`, `/checkout/success`

### D. User Dashboard `(dashboard)`
Protected routes for logged-in customers.
- `src/app/(dashboard)/layout.tsx` -> Injects standard Header + `<DashboardSidebar />`.
- Routes: `/dashboard`, `/dashboard/orders`, `/dashboard/addresses`

### E. Admin Panel `(admin)`
Strictly protected routes for staff. 
- `src/app/(admin)/layout.tsx` -> Injects `<AdminSidebar />` and dark-themed header.
- Routes: `/admin`, `/admin/products`, `/admin/orders`

## 2. Dynamic Routes
Used for data-driven pages.
- **Products:** `/product/[slug]/page.tsx`
- **Categories:** `/category/[slug]/page.tsx`
- **Admin Edit:** `/admin/products/[id]/page.tsx`

## 3. Special Next.js Routes

### A. Loading Routes (`loading.tsx`)
Placed in critical route segments to provide instant feedback while Server Components fetch data.
- `src/app/(shop)/product/[slug]/loading.tsx` -> Renders a Skeleton matching the product page layout.

### B. Error Routes (`error.tsx`)
React Error Boundaries that catch unexpected server or client crashes.
- `src/app/error.tsx` -> Global fallback.
- `src/app/(admin)/error.tsx` -> Admin-specific fallback.

### C. Not Found Routes (`not-found.tsx`)
Handles 404s natively.
- `src/app/not-found.tsx` -> "Page Not Found" with a link back to `/shop`.

## 4. Intercepting & Parallel Routes (Future Proofing)
- **Quick View Modal:** In the future, we can use Next.js Parallel Routes (`@modal`) and Intercepting Routes (`(..)product/[slug]`) to load a product detail view inside a modal when clicked from a grid, but falling back to the full page on hard refresh.

## 5. API Routes Structure
While we have a separate Express backend, Next.js Route Handlers (`src/app/api/...`) may be used as a BFF (Backend For Frontend) proxy to securely manage HttpOnly cookies during authentication.
- `src/app/api/auth/login/route.ts` -> Proxies to Express `/api/v1/login`.
