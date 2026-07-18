# 15 Stabilization Roadmap

## Goal
Transform the Phase 13.9 codebase from a "Feature Complete" state to a "Production Ready" state by systematically eliminating all identified bugs in the Master Bug Backlog.

## Phase 4: Bug Fix & Stabilization Sprint

### Week 1: Security & Integrity (Priority 1)
- **Task 1:** Refactor Authentication. Implement Axios Interceptors globally. Move access token to React Context.
- **Task 2:** Enforce Zod validation on ALL backend Express routes to prevent SQL errors and data corruption (especially Address Pincodes).
- **Task 3:** Implement global `deleted_at IS NULL` filters on all catalog and product queries to seal the Soft Delete data leak.

### Week 2: Functional Completion (Priority 2)
- **Task 4:** Complete the Forgot Password workflow (DB migration for tokens + Nodemailer integration).
- **Task 5:** Mount the Wishlist APIs and connect the Storefront UI to allow favoriting items.
- **Task 6:** Build the Customer Notes and Tags UI in the CRM Admin dashboard.

### Week 3: UI/UX Polish (Priority 3)
- **Task 7:** Fix React hydration errors on the Cart Drawer (`typeof window !== 'undefined'` checks).
- **Task 8:** Add missing `key` props to all `.map()` iterators in Admin tables.
- **Task 9:** Implement 404 pages for invalid product slugs.

## Sign-Off Criteria
- Zero Critical or High priority bugs remaining.
- All APIs return standardized responses without throwing 500 errors.
- The platform is ready for Phase 14 (Multi-Vendor/Advanced Roadmap).
