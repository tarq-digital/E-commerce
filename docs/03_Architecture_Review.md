# 03 Architecture Review

## 1. Monorepo Structure
- **Design:** The project uses a standard monorepo pattern (`apps/frontend`, `apps/backend`).
- **Review:** Solid and scalable. However, the `packages/` directory for shared types and UI components (mentioned in `engineering_foundation.md`) is currently underutilized. Types are often duplicated between backend JSDoc/Zod schemas and frontend TypeScript definitions.
- **Recommendation:** Implement a shared `packages/types` to synchronize Zod schemas across the stack.

## 2. Frontend Architecture (Next.js)
- **Design:** Next.js App Router with React Context and `cookies-next`.
- **Review:**
  - The App Router is correctly leveraged with Server and Client components where necessary.
  - The `services/` abstraction layer is well-maintained, preventing components from directly fetching data.
  - Custom React Hooks (`useAuth`, `useCart`) provide clean interfaces for state management.
  - CSS Modules keep styling collision-free.
- **Vulnerability:** Relying on `getCookie('token')` for API requests in client components exposes the access token to XSS if not handled carefully, deviating from the initial memory-only token strategy.

## 3. Backend Architecture (Express.js)
- **Design:** Layered Architecture (Controller -> Service -> Repository).
- **Review:**
  - The layered approach is highly successful and deeply ingrained in the codebase. Controllers strictly handle HTTP, Services handle logic, and Repositories handle data.
  - Authentication middleware seamlessly injects user context.
  - Global error handling effectively standardizes API responses.
- **Inconsistency:** The `database/migrations` system relies on a custom `migrate.js` script with raw `.sql` files instead of Prisma ORM (as documented). While raw SQL with `mysql2/promise` is performant and explicitly controlled, the documentation needs to reflect this pivot.

## 4. Database Architecture (MySQL)
- **Design:** Relational database with strict normal forms and historical snapshots.
- **Review:**
  - The schema design is highly robust. Snapshots (`shipping_address` JSON in `orders`, `price_at_purchase` in `order_items`) prevent historical corruption.
  - The ID strategy is mixed: `INT AUTO_INCREMENT` is used for most tables, while `UUID` is used for `orders` and `checkout_sessions`. This isn't inherently bad, but contradicts the `06-Database-Design.md` document which mandates UUIDs everywhere.
  - Foreign key constraints correctly utilize `ON DELETE CASCADE` or `RESTRICT` depending on business rules.

## 5. Third-Party Integrations
- **Payment (Razorpay):** Securely integrated with webhook signature validation to prevent spoofing.
- **Media (Cloudinary):** The `UploadService` securely streams buffers from memory to Cloudinary to prevent local disk exhaustion, a best practice for scalability.
