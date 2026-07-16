# Security Architecture (API Level) - Weebster

This document details the defensive engineering practices implemented across all API endpoints to protect against malicious actors.

---

## 1. Authentication Strategy (JWT + HttpOnly Cookies)
- **Why Cookies?** Storing JWTs in `localStorage` makes them vulnerable to Cross-Site Scripting (XSS). An attacker can easily read `localStorage.getItem('token')`.
- **Implementation:** The backend Login route responds with a `Set-Cookie` header:
  `Set-Cookie: access_token=eyJhb...; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/api/`
- **Frontend Impact:** The Next.js frontend does not need to manually attach the token to every Axios request. The browser does it automatically, but JavaScript cannot read the token.

## 2. Cross-Site Request Forgery (CSRF)
- Because we use Cookies, we are theoretically vulnerable to CSRF.
- **Mitigation 1:** The `SameSite=Strict` flag on the cookie instructs the browser to ONLY send the cookie if the request originates from `weebster.in`.
- **Mitigation 2:** (Future) A double-submit CSRF token header for state-mutating requests (POST/PUT/DELETE) if the `SameSite` flag proves insufficient for older browsers.

## 3. Input Validation (Zod)
- **Rule:** Never trust the client. Never pass `req.body` directly to Prisma.
- **Implementation:** Every endpoint must define a Zod schema. The `validateRequest` middleware parses the body against the schema. If it fails, it returns a `400 Bad Request` instantly. This prevents NoSQL injection (even though we use MySQL) and unexpected data types crashing the server.

## 4. Rate Limiting
- **Global Limit:** 100 requests per IP per minute. (Prevents basic DDoS).
- **Sensitive Route Limit:** `/api/v1/auth/login` and `/api/v1/auth/register` are strictly limited to 5 requests per IP per 15 minutes. (Prevents brute-force password guessing and credential stuffing).
- **Implementation:** `express-rate-limit` backed by Redis (V2) or in-memory (V1).

## 5. Cross-Origin Resource Sharing (CORS)
- The API is not public. It exists solely to serve the Weebster frontend.
- **Implementation:** 
  ```javascript
  app.use(cors({
    origin: ['https://weebster.in', 'http://localhost:3000'],
    credentials: true // Crucial for HttpOnly cookies
  }));
  ```

## 6. Sensitive Data Exposure
- Passwords are never returned in ANY API response.
- `created_at` and `updated_at` are safe to return.
- Admin endpoints (`/admin/users/:id`) return full PII. Storefront endpoints (`/store/reviews`) strictly mask names (`John D.`) and omit emails to prevent scraping.
