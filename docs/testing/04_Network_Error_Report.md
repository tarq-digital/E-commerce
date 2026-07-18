# 04 Network Error Report

## Wishlist API Missing
- **Endpoint:** `POST /api/v1/store/wishlist`
- **Status:** `404 Not Found`
- **Response Time:** 15ms
- **Payload:** `{ "productId": "uuid" }`
- **Root Cause:** The `wishlist` routes were never mounted in the Express main router (`api/routes/index.js`), despite the database schema for wishlists existing in `002_catalog_schema.up.sql`.
