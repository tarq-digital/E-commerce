# 02 Root Cause Analysis

## Bug: Analytics Token Exposure
- **File:** `frontend/src/app/(admin)/admin/analytics/reports/page.js`
- **Root Cause:** A React Client Component manually reads the token cookie via `cookies-next`. The API route abstraction `lib/axios.js` (which should handle interceptors) was bypassed entirely for this component.

## Bug: Address Validation Bypass
- **File:** `backend/src/api/routes/checkout.routes.js`
- **Root Cause:** The `POST /api/v1/store/checkout` route is missing Zod validation middleware. `checkout.controller.js` assumes all required fields (like `pincode`) are provided and valid, passing nulls straight into the Database Transaction layer, which crashes on SQL NOT NULL constraints.
