# 01 Verified Bug Report

## 1. Analytics Token Exposure
- **Status:** Verified
- **Evidence:** Source code analysis of `frontend/src/app/(admin)/admin/analytics/reports/page.js` at Line 18 explicitly calls `getCookie('token')`. This confirms the token is accessible to frontend scripts (not HttpOnly), posing a severe XSS risk.
- **Component:** `ReportsDashboard`

## 2. Product Soft-Delete Leak
- **Status:** Verified
- **Evidence:** `ProductRepository.getAll()` raw SQL queries lack the `deleted_at IS NULL` clause. Deleted items remain active on public storefront routes.

## 3. Forgot Password Crash
- **Status:** Verified
- **Evidence:** Expected DB table `password_reset_tokens` does not exist in any migration file. Submission triggers a 500 error in Express.
