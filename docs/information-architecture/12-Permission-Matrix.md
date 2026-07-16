# Permission Matrix - Weebster

This document defines the Role-Based Access Control (RBAC) system for the Weebster platform. It ensures absolute security boundary separation between customers and administrative staff.

---

## 1. Role Definitions

| Role | Definition | Scope |
|------|------------|-------|
| **Guest** | Unauthenticated user. | Public Storefront. |
| **Customer** | Authenticated user via JWT. | Public Storefront + User Dashboard. |
| **Admin** | Highly privileged user. Currently possesses full system access. | Admin Dashboard. |
| **Staff (Future)** | Restricted admin user. Can manage orders, but not global settings. | Admin Dashboard (Limited). |
| **Super Admin (Future)** | Ultimate authority. Can create/delete Admins. | Admin Dashboard. |

## 2. API & Route Permission Matrix

This matrix governs both frontend route protection (Next.js Middleware) and backend API route protection (Express authorization middleware).

| Module / Action | Guest | Customer | Admin | Future Staff |
|-----------------|:-----:|:--------:|:-----:|:------------:|
| **Public Catalog** | ✅ | ✅ | ✅ | ✅ |
| **Cart (Local Storage)**| ✅ | ✅ | - | - |
| **Cart (DB Sync)** | ❌ | ✅ | ❌ | ❌ |
| **Checkout (Guest)** | ✅ | ❌ | ❌ | ❌ |
| **Checkout (Auth)** | ❌ | ✅ | ❌ | ❌ |
| **View Own Orders** | ❌ | ✅ | ❌ | ❌ |
| **Manage Own Address**| ❌ | ✅ | ❌ | ❌ |
| **Login / Register** | ✅ | ❌ | ✅ | ✅ |
| **Admin Dashboard Access**| ❌ | ❌ | ✅ | ✅ |
| **View All Orders** | ❌ | ❌ | ✅ | ✅ |
| **Update Order Status** | ❌ | ❌ | ✅ | ✅ |
| **Create/Edit Product** | ❌ | ❌ | ✅ | ❌ |
| **Delete Product** | ❌ | ❌ | ✅ | ❌ |
| **Manage Banners** | ❌ | ❌ | ✅ | ❌ |
| **Manage Users/Roles**| ❌ | ❌ | ✅ | ❌ |

## 3. Implementation Strategy

### Frontend Enforcement (Next.js Middleware)
- Next.js Edge Middleware will inspect the JWT cookie on every request.
- Requests to `/dashboard/*` without a valid token will trigger a `302 Redirect` to `/auth/login?redirect=/dashboard`.
- Requests to `/admin/*` without an `ADMIN` role token will trigger a `403 Forbidden` or redirect to the storefront.

### Backend Enforcement (Express)
- Frontend protection is UX only, not actual security. The real enforcement happens on the Node.js API.
- All `/api/v1/admin/*` routes will pass through a `requireAdmin` middleware that strictly validates the JWT signature and role payload against the database secret.
- **Data Isolation:** The `requireCustomer` middleware for `/api/v1/user/orders` must ensure that the `userId` in the JWT strictly matches the `userId` of the orders being requested. A customer cannot request `/orders/5` if order 5 belongs to another user.
