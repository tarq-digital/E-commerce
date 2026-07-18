# 09 Implementation Gap Analysis

## 1. Overview
This report highlights the "gaps" between the intended Business Logic (as defined in the `PRD.md` and `Architecture.md`) and the current technical reality at the end of Phase 13.9.

## 2. Identified Gaps

### 2.1 The "Soft Delete" Gap
- **Intended:** Products and Users are never hard-deleted to preserve foreign key constraints for historical Orders.
- **Implemented:** The database schema has `deleted_at`, but many admin deletion routes (e.g., in `category.controller.js` or `product.controller.js`) might be executing actual `DELETE FROM` SQL statements instead of `UPDATE ... SET deleted_at = NOW()`.
- **Action Required:** Audit and refactor all `DELETE` API endpoints in the backend to ensure they respect the Soft Delete pattern.

### 2.2 The "Zod Validation" Gap
- **Intended:** Strict schema validation on all incoming request payloads before they hit the controller.
- **Implemented:** While the `src/validators/` directory exists, it is not universally applied to all routes in `src/api/routes/`. Many Admin controllers manually check for `if (!req.body.title)` instead of relying on a centralized middleware.
- **Action Required:** Enforce Zod middleware globally across all `POST`, `PUT`, and `PATCH` routes.

### 2.3 The "Analytics Dashboard" Gap
- **Intended:** The Admin Analytics dashboard should show real-time aggregated metrics.
- **Implemented:** The UI components exist (`admin/analytics/reports/page.js`), but the backend relies on basic aggregate queries. The system lacks the "Snapshot Reporting architecture" planned in the architectural refinements (e.g., Daily Snapshot, Weekly Snapshot). Heavy real-time aggregations will cause database locks at scale.
- **Action Required:** Implement a cron job architecture to calculate and store daily metrics snapshots.

### 2.4 The "Promotion Stackability" Gap
- **Intended:** The system supports advanced promotion logic (`can_stack`, `stack_group`) to prevent users from applying conflicting discounts.
- **Implemented:** The architecture placeholders exist in the DB, but the Cart calculation engine does not fully respect complex stacking matrix logic. It currently applies basic percentage or flat discounts.
- **Action Required:** Develop the Promotion Conflict Resolution Engine before launching discount campaigns.

### 2.5 The "Authentication Token" Gap
- **Intended:** The Access Token should be stored exclusively in application memory (React Context/Zustand), making it immune to XSS.
- **Implemented:** Admin frontend components utilize `getCookie('token')` to manually fetch the token and attach it to API requests.
- **Action Required:** Refactor the frontend to store the Access Token in a React Provider and use an Axios Interceptor.

## 3. Conclusion
The foundation up to Phase 13.9 is solid, but before moving to Post-V1 features (Multi-vendor, AI Search), these architectural gaps must be closed to prevent technical debt from snowballing.
