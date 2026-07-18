# 02 Functional Test Report

## 1. Overview
Testing specific business functionalities across the Storefront and Admin panels.

## 2. Storefront Functionality
- **Catalog Browsing:** ✅ Working. Pagination and Category filtering behave correctly.
- **Cart Operations:** ✅ Working. LocalStorage correctly syncs guest carts.
- **Wishlist:** ⚠ Exists but disconnected. The DB schema exists (`wishlists`), but the frontend heart icon toggle throws a 404 because the `POST /wishlist` endpoint is missing from `src/api/routes`.
- **Checkout Address Validation:** ❌ Broken. Users can submit an empty Pincode, causing razorpay/shipping estimation logic to break downstream.

## 3. Admin Functionality
- **Product Management:** ✅ Working. Full CRUD operations succeed.
- **Order State Machine:** ✅ Working. `PENDING -> PROCESSING -> SHIPPED` correctly updates the database.
- **CRM Customer Notes:** ❌ Broken. The schema `customer_notes` exists, but there is no UI in the `admin/customers/[id]` page to add or view these notes.
- **Media Uploads:** ✅ Working. Cloudinary streams correctly handle images.
- **Analytics Widgets:** ⚠ Exists but disconnected. The Dashboard displays static or poorly aggregated data instead of using the robust KPI formula engine designed in the DB.
