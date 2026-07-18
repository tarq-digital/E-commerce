# 14 Master Bug Backlog

## Pending Resolutions

1. **[Critical] BUG-001:** Refactor `getCookie('token')` in frontend admin components to use Context and Axios Interceptors to prevent XSS.
2. **[Critical] BUG-003:** Update all public read queries in `ProductRepository` and `CategoryRepository` to include `WHERE deleted_at IS NULL`.
3. **[High] BUG-002:** Create `password_reset_tokens` migration and fully implement the Forgot Password mailer logic.
4. **[High] BUG-004:** Implement global Zod validation middleware on the Express backend, specifically targeting `POST /checkout`.
5. **[Medium] BUG-005:** Mount the Wishlist APIs in the Express router and connect the Storefront UI to it.
6. **[Medium] BUG-007:** Fix React hydration errors on the Cart Drawer by ensuring `localStorage` initialization only happens inside `useEffect`.
7. **[Low] BUG-006:** Build the UI components for Customer Notes and Tags in the Admin CRM panel.
