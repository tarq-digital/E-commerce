# Admin API - Weebster

This namespace provides strict, highly privileged endpoints for the management dashboard. All routes require an `ADMIN` role JWT.

---

## 1. Global Admin Headers & Auth
All `/api/v1/admin/*` endpoints pass through the `requireAdmin` middleware. If a `CUSTOMER` token attempts access, the API strictly returns `403 Forbidden`.

## 2. Product Management (CRUD)
- **GET `/api/v1/admin/products`:** Offset paginated list of all products (including inactive/deleted). Includes heavy JOINs (variants, stock) not exposed in the storefront API.
- **POST `/api/v1/admin/products`:** Creates the base product row.
- **PUT `/api/v1/admin/products/:id`:** Full replacement of product details.
- **PATCH `/api/v1/admin/products/:id/status`:** Quick toggle `is_active`.
- **DELETE `/api/v1/admin/products/:id`:** Executes Soft Delete (`deleted_at`).

## 3. Variant & Inventory Management
- **POST `/api/v1/admin/products/:id/variants`:** Add a new SKU/Color/Size.
- **PATCH `/api/v1/admin/inventory/:variant_id`:** Directly adjust physical stock counts (`qty_available`). This route logs an audit trail if an Admin manually forces a stock increase.

## 4. Order Management
- **GET `/api/v1/admin/orders`:** Offset paginated list. Filters: `?status=PENDING`, `?search=ORD-123`.
- **GET `/api/v1/admin/orders/:id`:** Full unredacted data dump (shipping address, user details, payment details).
- **PATCH `/api/v1/admin/orders/:id/status`:** 
  ```json
  { "status": "SHIPPED", "tracking_number": "AWB123456" }
  ```
  **Side Effect:** Transitioning to `SHIPPED` triggers the Notification API to email the customer.

## 5. Category Management
- **POST `/api/v1/admin/categories`:** Creates taxonomy.
- **PUT `/api/v1/admin/categories/:id`:** Updates details. Note: Changing the `slug` will break SEO links on the frontend unless a redirect is implemented.

## 6. Customer Management
- **GET `/api/v1/admin/users`:** List all customers.
- **GET `/api/v1/admin/users/:id`:** View specific customer profile, address book, and lifetime order history.
- **PATCH `/api/v1/admin/users/:id/ban`:** Revoke access (V2).
