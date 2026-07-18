# 05 API Failure Report

## 1. POST /api/v1/store/checkout
- **Failure:** 500 Internal Server Error when missing Pincode.
- **Root Cause:** Controller assumes `req.body` is completely valid. `OrderService.createOrder` attempts to insert into DB, triggering SQL `ER_BAD_NULL_ERROR`.

## 2. POST /api/v1/auth/forgot-password
- **Failure:** 500 Internal Server Error.
- **Root Cause:** `EmailService.sendPasswordReset` lacks configured Nodemailer SMTP credentials in `.env`, resulting in `ECONNREFUSED`. The token is not saved to the DB either.
