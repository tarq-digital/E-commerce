# 07 Database Failure Report

## 1. Product Repository Leak
- **File:** `backend/src/modules/catalog/repositories/product.repository.js`
- **Query:** `SELECT * FROM products ORDER BY created_at DESC`
- **Root Cause:** Must be updated to `SELECT * FROM products WHERE deleted_at IS NULL ORDER BY created_at DESC`.

## 2. Missing Password Reset Table
- **File:** `backend/database/migrations/`
- **Root Cause:** The `password_reset_tokens` table was not included in the original authentication schema, preventing the forgot password flow from working.
