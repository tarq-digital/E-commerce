# Security Architecture - Weebster

Database security ensures the protection of Personally Identifiable Information (PII) and prevents malicious data manipulation.

---

## 1. Authentication Storage

### Passwords
- **Storage:** Stored in `users.password_hash`.
- **Encryption:** Never stored in plaintext. We mandate the use of `bcrypt` with a minimum cost factor of 12, or `Argon2`.
- **Validation:** Minimum 8 characters, requiring mixed case and numbers, enforced at the application level.

### JWTs & Sessions
- **Stateless Authentication:** Weebster primarily relies on stateless JWTs stored in HttpOnly, Secure, SameSite=Strict cookies to prevent XSS and CSRF attacks.
- **Refresh Tokens (Future V2):** To allow for remote session invalidation, a `sessions` table will be introduced to track valid refresh tokens. If an admin bans a user, their refresh token is deleted from the DB, terminating their session instantly.

## 2. SQL Injection (SQLi) Protection
- **ORM Enforced:** By using Prisma ORM, raw SQL queries are fundamentally bypassed in favor of parameterized queries constructed by the Prisma Query Engine. This entirely mitigates traditional SQL injection.
- **Raw Queries:** If a `Prisma.$queryRaw` is absolutely necessary for complex analytics, it MUST use parameterized syntax. String concatenation is banned.

## 3. PII (Personally Identifiable Information) Handling
- `addresses`, `users.phone`, and `users.email` are classified as sensitive PII.
- **Data Minimization:** We do not store Credit Card numbers, CVVs, or expiration dates. All payment processing is offloaded to Razorpay. We only store the Razorpay transaction IDs.
- **Right to be Forgotten (GDPR/DPDP):** Soft-deleting a user sets `deleted_at`, but an additional script must be provided to physically overwrite `first_name`, `last_name`, `phone`, and `email` with anonymized hashes if the user explicitly requests complete deletion, while preserving the integer `id` for order history integrity.

## 4. Privilege Separation & Secrets
- **Database User Roles:** The Node.js application connects to MySQL using a specifically scoped database user (e.g., `app_user`). This user has `SELECT`, `INSERT`, `UPDATE`, `DELETE` privileges, but NOT `DROP`, `ALTER`, or `GRANT` privileges.
- **Secret Management:** Database URLs (`DATABASE_URL`) are never committed to version control. They are injected securely via host environment variables (Hostinger/Vercel secrets).
