# 08 Authentication Report

## 1. JWT Storage Vulnerability
- **Trace:** 
  1. `auth.controller.js` creates a JWT.
  2. Frontend stores it as a generic cookie.
  3. Client components read it via `getCookie('token')`.
- **Verdict:** Highly insecure for enterprise apps. Must transition to an HttpOnly cookie strategy for access tokens or purely React Context state memory to mitigate XSS attacks.

## 2. Role-Based Access Control (RBAC)
- **Trace:** `authorizeRoles('ADMIN')`
- **Verdict:** ✅ Functioning perfectly. Non-admin tokens are correctly blocked from accessing `/admin` endpoints, returning `403 Forbidden`.
