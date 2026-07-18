# 09 Master Bug Report

## BUG-001: Admin Analytics Token XSS Vulnerability
- **Severity:** Critical
- **Module:** Admin / Analytics
- **Page:** `admin/analytics/reports/page.js`
- **Steps to Reproduce:**
  1. Open Admin Reports page.
  2. The client component calls `getCookie('token')`.
- **Expected Result:** Tokens should be handled securely in memory or passed via secure HTTP-only cookies transparently by Axios.
- **Actual Result:** Exposes access token to XSS scripts.
- **Root Cause:** Bypassed standardized `services/` layer abstraction.
- **Recommended Fix:** Refactor to use React Context for access tokens and Axios interceptors.

## BUG-002: Forgot Password Workflow Crash
- **Severity:** High
- **Module:** Auth
- **Page:** `/forgot-password`
- **Steps to Reproduce:**
  1. Go to forgot password page.
  2. Enter valid email and submit.
- **Expected Result:** Receives success toast, email dispatched.
- **Actual Result:** Server responds with `500 Internal Server Error`.
- **Root Cause:** SMTP configuration in `EmailService` is missing, and the database lacks a token storage table.
- **Recommended Fix:** Implement `password_reset_tokens` table and configure Nodemailer/SendGrid transport.

## BUG-003: Product Soft-Delete Storefront Leak
- **Severity:** High
- **Module:** Catalog
- **Page:** `/products` (Storefront)
- **Steps to Reproduce:**
  1. Admin "deletes" a product (sets `deleted_at`).
  2. Customer visits storefront catalog.
- **Expected Result:** Deleted product is hidden.
- **Actual Result:** Deleted product appears in catalog.
- **Root Cause:** The `ProductRepository.getAll()` raw SQL query lacks `WHERE deleted_at IS NULL`.
- **Recommended Fix:** Append strict soft-delete filters to all public catalog read queries.

## BUG-004: Checkout Address Validation Bypass
- **Severity:** Medium
- **Module:** Checkout
- **Page:** `/checkout`
- **Steps to Reproduce:**
  1. Leave Pincode blank.
  2. Click Pay Now.
- **Expected Result:** Form blocks submission, highlights Pincode in red.
- **Actual Result:** Order is generated with a null pincode, breaking shipping aggregator logistics later.
- **Root Cause:** Missing Zod validation schema on the `POST /checkout` route.
- **Recommended Fix:** Implement Zod middleware for address schema validation.

## BUG-005: Wishlist Button 404
- **Severity:** Medium
- **Module:** Storefront / Catalog
- **Page:** `/products/[slug]`
- **Steps to Reproduce:**
  1. Log in as a customer.
  2. Click the Heart icon on a product.
- **Expected Result:** Icon turns red, item added to wishlist.
- **Actual Result:** Network tab shows `POST /api/v1/wishlist` -> `404 Not Found`.
- **Root Cause:** The wishlist API routes were never mounted in `src/api/routes/index.js`.
- **Recommended Fix:** Build and mount `wishlist.routes.js`.

## BUG-006: Missing CRM Notes UI
- **Severity:** Low
- **Module:** Admin / CRM
- **Page:** `/admin/customers/[id]`
- **Steps to Reproduce:**
  1. Open a customer profile in Admin.
  2. Look for the "Add Note" section.
- **Expected Result:** Form to add admin-only notes.
- **Actual Result:** Section is missing from the UI.
- **Root Cause:** Phase 13.5 database schema (`customer_notes`) was created, but frontend components were deferred.
- **Recommended Fix:** Build `<CustomerNotesPanel>` React component.
