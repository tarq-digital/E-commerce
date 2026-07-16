# Security Standards & Implementation

## 1. Authentication & Authorization
**JWT (JSON Web Tokens):**
- Tokens are NOT stored in `localStorage` or `sessionStorage` to prevent XSS (Cross-Site Scripting) theft.
- Tokens are issued by the backend and set as `HttpOnly`, `Secure`, and `SameSite=Strict` cookies.
- **Expiration:** Access tokens expire in 15 minutes. Refresh tokens (if implemented) are stored in the DB and expire in 7 days.
- **Password Hashing:** Passwords are hashed using `bcrypt` with a minimum salt round of 10 before saving to MySQL.

**Role-Based Access Control (RBAC):**
- Middleware `isAdmin` checks the decoded JWT role.
- If `role !== 'admin'`, the API immediately rejects with `403 Forbidden`.

## 2. API Security Protections
### 2.1. Rate Limiting
Implemented using `express-rate-limit` to prevent brute-force and DDoS attacks.
- **Global:** 100 requests per minute per IP.
- **Login/Register Routes:** 5 requests per 15 minutes per IP.

### 2.2. Secure Headers
Implemented using `helmet`.
- Hides `X-Powered-By: Express`.
- Enforces Content Security Policy (CSP).
- Prevents Clickjacking (X-Frame-Options).

### 2.3. Input Validation & Sanitization
- All incoming requests (Body, Query, Params) are validated against strict schemas (using libraries like `Joi` or `Zod`).
- Prevents NoSQL/SQL Injection by ensuring data types are correct before hitting the database.
- Database queries use parameterized queries (via Sequelize/Knex) to entirely eliminate SQL Injection risks.

### 2.4. Cross-Site Request Forgery (CSRF)
- Prevented using `SameSite=Strict` on authentication cookies.
- For sensitive state-changing operations (like Checkout), a CSRF token strategy can be employed if the frontend and backend are not on the exact same origin.

### 2.5. Cross-Origin Resource Sharing (CORS)
- Backend CORS policy strictly allows requests ONLY from the Weebster frontend domain (e.g., `https://weebster.in`).
- No wildcard (`*`) origins are permitted in production.

## 3. Data Protection
- **Transit:** All communication is enforced over HTTPS (TLS 1.2+).
- **Secrets Management:** Database credentials, JWT secrets, and Payment API keys are stored in `.env` files and injected via the host environment. They are never committed to version control.
- **Payment Data:** Weebster does NOT store credit card details. All PCI-DSS compliance is offloaded to Razorpay.

## 4. Third-Party Integrations
- **Cloudinary:** Image uploads are authenticated using a signed signature from the backend. The frontend cannot upload directly without requesting a signature, preventing malicious file hosting.
- **Razorpay:** Payment verification relies strictly on server-to-server webhook verification using the Razorpay secret to prevent client-side payment spoofing.

## 5. Logging and Monitoring
- Sensitive data (Passwords, Tokens, PII) is scrubbed/masked before being written to application logs.
- Failed login attempts and unauthorized access to admin routes trigger warning logs for monitoring.
- Regular database backups are automated to prevent data loss.

## 6. OWASP Top 10 Checklist Addressed
- [x] Broken Access Control (RBAC, API authorization)
- [x] Cryptographic Failures (HTTPS, bcrypt)
- [x] Injection (Parameterized queries, Input Validation)
- [x] Insecure Design (Least privilege principles)
- [x] Security Misconfiguration (Helmet, disabled dev logs in prod)
- [x] Vulnerable and Outdated Components (Dependabot for npm packages)
- [x] Identification and Authentication Failures (JWT, Rate limiting)
