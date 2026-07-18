# 10 Evidence Based Master Bug List

1. **XSS Vulnerability in Analytics:** Token exposed in Client component (`frontend/src/app/(admin)/admin/analytics/reports/page.js`, Line 18).
2. **Missing Wishlist Route:** 404 Not Found on `POST /api/v1/store/wishlist`. Route logic omitted from `api/routes/index.js`.
3. **Broken SMTP Reset:** 500 Error on `POST /auth/forgot-password`. Missing `password_reset_tokens` DB table.
4. **Hydration Error on Cart:** Console warning indicating `localStorage` read mismatch during SSR hydration.
5. **Missing Zod Checkout Validation:** SQL Error thrown on null pincode submission due to missing express middleware (`checkout.routes.js`).
6. **Soft Delete Product Leak:** Deleted items visible on storefront because `ProductRepository.getAll()` lacks `WHERE deleted_at IS NULL`.
7. **Missing CRM Notes UI:** `<CustomerNotesPanel>` does not exist in `customers/[id]/page.js`.
