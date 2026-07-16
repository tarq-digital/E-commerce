# Weebster - Engineering Foundation & Architecture Guide

This document serves as the permanent engineering foundation for the Weebster e-commerce platform. It outlines the architectural decisions, coding standards, project structure, and best practices to ensure maintainability, scalability, and high performance for a production-grade application.

---

## 1. Repository Architecture

Weebster utilizes a **Monorepo** architecture managed by **npm workspaces** (and optionally Turborepo for task orchestration). 

### High-Level Structure
```text
weebster/
├── apps/
│   ├── frontend/       # Next.js web application
│   └── backend/        # Express.js API server
├── packages/
│   ├── config/         # Shared configurations (ESLint, Prettier, TSConfig)
│   ├── ui/             # Shared UI components (future-proofing for mobile/admin)
│   └── types/          # Shared JSDoc types & schemas
├── docs/               # Project documentation (Architecture, API, Setup)
├── scripts/            # Automation and CI/CD scripts
├── .github/            # GitHub Actions workflows and issue templates
├── .husky/             # Git hooks
├── package.json        # Root workspace configuration
└── README.md
```

### Rationale & Scalability
- **Code Sharing**: A monorepo allows sharing validation schemas, constants, and configurations between the frontend and backend, ensuring absolute consistency.
- **Atomic Commits**: Features requiring both frontend and backend changes can be committed and reviewed in a single PR.
- **Future Scalability**: Adding an `admin-dashboard` or a `mobile-app` (React Native) in the future is seamless within the `apps/` directory, reusing the `packages/ui` and `packages/types`.

---

## 2. Frontend Foundation

The frontend is built using **Next.js (App Router)**.

### Architecture Structure (`apps/frontend/`)
```text
frontend/
├── src/
│   ├── app/            # Next.js App Router (Pages, Layouts, API routes if any)
│   ├── components/     # Reusable UI components
│   │   ├── common/     # Buttons, Inputs, Modals
│   │   ├── layout/     # Header, Footer, Sidebar
│   │   └── features/   # ProductCard, CartDrawer (Domain specific)
│   ├── hooks/          # Custom React hooks (e.g., useAuth, useCart)
│   ├── contexts/       # React Context providers (Global state)
│   ├── services/       # API client calls (e.g., api/products.ts)
│   ├── lib/            # Third-party library initializations (Axios, Cloudinary)
│   ├── config/         # Environment and app configuration constants
│   ├── constants/      # App-wide constants (Routes, Action types)
│   ├── styles/         # Global CSS and CSS Modules
│   ├── utils/          # Pure helper functions (formatting, validation)
│   ├── types/          # Frontend-specific JSDoc types
│   ├── providers/      # Wrapping components (ThemeProvider, AuthProvider)
│   └── middlewares/    # Next.js edge middlewares (Route protection)
├── public/             # Static assets (images, fonts, icons)
├── .env.example
├── next.config.js
└── package.json
```

### Conventions & Maintainability
- **Component Isolation**: Components are grouped by `common` (dumb components) and `features` (domain-bound components).
- **Service Layer**: Components NEVER make direct `fetch` calls. All API interactions are abstracted into the `services/` folder using Axios, allowing centralized error handling and interceptors.
- **CSS Modules**: Used for component-scoped styling to prevent global CSS conflicts, while `styles/global.css` is reserved for CSS variables and resets.
- **Absolute Imports**: Configured to use `@/*` to prevent deeply nested relative imports (e.g., `../../../utils`).

---

## 3. Backend Foundation

The backend utilizes **Express.js** with a strict **Layered Architecture (Controller-Service-Repository)**.

### Architecture Structure (`apps/backend/`)
```text
backend/
├── src/
│   ├── api/            
│   │   ├── controllers/  # Handles HTTP requests/responses
│   │   ├── routes/       # Route definitions and middleware binding
│   │   └── validators/   # Request payload validation (Zod/Joi)
│   ├── services/         # Core business logic
│   ├── repositories/     # Data access layer (Database queries)
│   ├── middlewares/      # Express middlewares (Auth, Error Handler, Logger)
│   ├── models/           # Database models/schema definitions
│   ├── config/           # Database, App, and Third-party configurations
│   ├── utils/            # Helper functions
│   ├── constants/        # System-wide constants
│   ├── jobs/             # Cron jobs and background tasks
│   ├── logs/             # Generated log files (ignored in Git)
│   ├── uploads/          # Temporary file storage before Cloudinary upload
│   ├── mail/             # Email templates and dispatchers
│   └── storage/          # Cloudinary/S3 service abstractions
├── .env.example
├── server.js             # App entry point
└── package.json
```

### Architectural Decisions
- **Separation of Concerns**: 
  - *Controllers* only handle HTTP layer (req/res).
  - *Services* handle business rules.
  - *Repositories* abstract the database layer. If we switch from raw MySQL to an ORM later, only repositories change.
- **Fat Services, Skinny Controllers**: Keeps business logic testable without mocking HTTP objects.

---

## 4. Coding Standards

### Naming Conventions
| Element | Convention | Example |
|---------|------------|---------|
| Folders | kebab-case | `user-profile`, `shopping-cart` |
| Files (General) | kebab-case | `date-utils.ts`, `product-service.ts` |
| React Components | PascalCase | `ProductCard.tsx`, `Header.tsx` |
| Functions | camelCase | `calculateTotal()`, `getUser()` |
| Variables | camelCase | `isAuthenticated`, `orderTotal` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `API_BASE_URL` |
| DB Tables | snake_case (plural) | `users`, `order_items` |
| API Endpoints | kebab-case (plural) | `/api/v1/products`, `/api/v1/users/:id` |

### Git Conventions
- **Branches**: `feature/<ticket>-<description>`, `bugfix/...`, `hotfix/...`, `release/vX.Y.Z`
- **Commits**: Conventional Commits standard (`feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`).

### Code Constraints
- **Max File Size**: 300 lines. If larger, refactor and split.
- **Max Function Size**: 40 lines.
- **Max Component Size**: 150 lines.
- **Max Nesting Level**: 3 levels of indentation.
- **Imports**: Grouped by: 1. Built-in, 2. External packages, 3. Internal aliases (`@/`), 4. Relative paths.

---

## 5. Environment Configuration

Strict separation of environments ensures security and predictable deployments.

| File | Purpose | Committed to Git? |
|------|---------|-------------------|
| `.env.example` | Template containing all required keys with dummy values. | Yes |
| `.env.development` | Local development database and test API keys. | No |
| `.env.production` | Production database and live API keys (managed via CI/CD). | No |
| `.env.local` | Developer-specific overrides for local testing. | No |

### Security Rules
- Frontend Next.js public variables MUST be prefixed with `NEXT_PUBLIC_`.
- Backend secrets (JWT, DB passwords, Razorpay Secrets) MUST NEVER be logged or sent to the client.

---

## 6. Configuration Files

- **ESLint**: Configured for strict JavaScript and React rules. Prevents unused variables, enforces dependency arrays in hooks, and maintains code quality.
- **Prettier**: Enforces consistent formatting (tabs vs spaces, line length = 100, trailing commas).
- **EditorConfig**: Ensures consistent IDE behavior across developers (line endings = LF, charset = utf-8).
- **VSCode Settings (`.vscode/settings.json`)**: Auto-format on save, organize imports on save.

---

## 7. Git Workflow

We utilize a structured **Git Flow**.

1. `main`: Strictly represents production-ready code. Commits here trigger production deployment.
2. `development`: The main integration branch. All features merge here first.
3. **Pull Requests**:
   - Require at least 1 approval from a Senior Engineer.
   - Must pass all CI checks (Lint, Build, Tests).
   - Require linear history (Squash and Merge).
4. **Branch Protection**: `main` and `development` cannot be pushed to directly.

---

## 8. Project Documentation

Located in the `docs/` folder:

- `README.md`: High-level overview, tech stack, and quick start guide.
- `CONTRIBUTING.md`: Git workflow, PR guidelines, and coding standards.
- `CHANGELOG.md`: Maintained automatically via Semantic Release.
- `architecture.md`: System design, database schema diagrams.
- `api-specs.md`: REST API documentation (or OpenAPI/Swagger definitions).
- `deployment.md`: Guide for deploying to Hostinger VPS.

---

## 9. Logging Strategy

- **Backend**: **Winston** combined with **Morgan** (for HTTP logs).
  - *Levels*: `error` (0), `warn` (1), `info` (2), `http` (3), `debug` (4).
  - *Transports*: Console (development), Rolling File (production, rotated daily), and readiness for external log aggregators (e.g., Datadog/ELK).
- **Frontend**: Custom logger utility. `console.log` is strictly banned in production builds via ESLint and Webpack plugins.
- **Monitoring Readiness**: Logs include `transaction_id` for tracing requests across microservices/modules.

---

## 10. Error Handling Strategy

- **Global Error Handler (Backend)**: A centralized Express middleware catches all unhandled exceptions.
- **Standardized API Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_FAILED",
      "message": "Invalid email format",
      "details": [...]
    }
  }
  ```
- **AppError Class**: Custom class extending `Error` to include HTTP status codes and operational flags.
- **Frontend**: React **Error Boundaries** catch UI crashes and display fallback components instead of blank screens. Axios interceptors globally handle 401 (trigger logout) and 500 (toast notification).

---

## 11. Security Foundation

- **Authentication**: JWT based. 
  - Access Token: Short-lived (15m), stored in memory (React state).
  - Refresh Token: Long-lived (7d), stored in **HttpOnly, Secure, SameSite=Strict cookies**.
- **Data Protection**: 
  - Passwords hashed using `bcrypt` (salt rounds: 12).
  - SQL Injection prevented by using parameterized queries/ORM.
  - XSS prevented via React's default escaping and strict Content Security Policy (CSP).
- **Network Security**:
  - `Helmet.js` for secure HTTP headers.
  - `express-rate-limit` to prevent brute force and DDoS.
  - CORS strictly configured to allow only the production and development frontend domains.

---

## 12. Performance Foundation

- **Frontend Code Splitting**: Next.js automatically splits code by route. Heavy components (e.g., Rich Text Editors) use `next/dynamic` for lazy loading.
- **Image Optimization**: Images served via Cloudinary and rendered using Next.js `<Image>` component for WebP conversion and responsive sizing.
- **Caching**: 
  - API responses cached using Redis (future readiness) or memory cache for heavily read, rarely updated data (e.g., Categories).
  - Next.js ISR (Incremental Static Regeneration) for Product Pages.
- **Database**: Indexes planned on foreign keys and frequently searched columns (e.g., `sku`, `category_id`).

---

## 13. Developer Experience (DX)

- **Absolute Imports**: Configured in `tsconfig.json` (`@/*`) to eliminate `../../../` hell.
- **Lint-Staged & Husky**: Pre-commit hooks run ESLint and Prettier ONLY on changed files, ensuring fast but strict commits.
- **NPM Scripts**: Standardized scripts across apps (`npm run dev`, `npm run build`, `npm run lint`).
- **VS Code Extensions**: A `.vscode/extensions.json` file recommends ESLint, Prettier, and Prisma extensions to new developers upon project open.

---

## 14. Future Scalability

The architecture is designed to support 10,000+ products and high traffic:
- **Modular Services**: The backend `services/` layer makes it trivial to extract a service (e.g., `InventoryService`) into a standalone microservice later.
- **Headless Ready**: The API is completely decoupled from the Next.js frontend, allowing seamless integration with a future React Native mobile app or external CRM/ERP.
- **Storage Abstraction**: File uploads are handled via an interface. Currently implemented for Cloudinary, but can easily be swapped to AWS S3 without changing business logic.

---

## 15. Quality Assurance Standards

### Definition of Ready (DoR)
- Ticket has clear acceptance criteria.
- UI designs (Figma) are finalized.
- API contracts are agreed upon.

### Definition of Done (DoD)
- Code meets all linting and formatting standards.
- Feature works locally and in the staging environment.
- No sensitive data is exposed.
- PR is reviewed and approved by at least 1 peer.

---

## 16. Final Production Folder Structure

```text
weebster-monorepo/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── .husky/
│   ├── pre-commit
│   └── commit-msg
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── auth.controller.js
│   │   │   │   │   ├── product.controller.js
│   │   │   │   │   └── order.controller.js
│   │   │   │   ├── routes/
│   │   │   │   │   ├── auth.routes.js
│   │   │   │   │   ├── product.routes.js
│   │   │   │   │   ├── order.routes.js
│   │   │   │   │   └── index.js
│   │   │   │   └── validators/
│   │   │   │       ├── auth.validator.js
│   │   │   │       └── product.validator.js
│   │   │   ├── config/
│   │   │   │   ├── database.js
│   │   │   │   ├── env.js
│   │   │   │   └── logger.js
│   │   │   ├── constants/
│   │   │   │   ├── error-codes.js
│   │   │   │   └── roles.js
│   │   │   ├── middlewares/
│   │   │   │   ├── auth.middleware.js
│   │   │   │   ├── error.middleware.js
│   │   │   │   └── rate-limiter.js
│   │   │   ├── models/
│   │   │   │   ├── user.model.js
│   │   │   │   ├── product.model.js
│   │   │   │   └── order.model.js
│   │   │   ├── repositories/
│   │   │   │   ├── user.repository.js
│   │   │   │   └── product.repository.js
│   │   │   ├── services/
│   │   │   │   ├── auth.service.js
│   │   │   │   ├── payment.service.js
│   │   │   │   └── mail.service.js
│   │   │   └── utils/
│   │   │       ├── api-error.js
│   │   │       └── catch-async.js
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── server.js
│   └── frontend/
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/
│       │   │   │   ├── login/page.tsx
│       │   │   │   └── register/page.tsx
│       │   │   ├── (shop)/
│       │   │   │   ├── products/page.tsx
│       │   │   │   └── cart/page.tsx
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/
│       │   │   ├── common/
│       │   │   │   ├── Button/
│       │   │   │   └── Input/
│       │   │   ├── layout/
│       │   │   │   ├── Navbar/
│       │   │   │   └── Footer/
│       │   │   └── features/
│       │   │       ├── ProductCard/
│       │   │       └── CartDrawer/
│       │   ├── config/
│       │   │   └── site.ts
│       │   ├── contexts/
│       │   │   └── CartContext.tsx
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   └── useDebounce.ts
│       │   ├── lib/
│       │   │   ├── axios.ts
│       │   │   └── utils.ts
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   └── product.service.ts
│       │   ├── styles/
│       │   │   └── globals.css
│       │   └── types/
│       │       ├── index.d.ts
│       │       └── user.ts
│       ├── public/
│       │   ├── images/
│       │   └── favicon.ico
│       ├── .env.example
│       ├── next.config.js
│       ├── package.json
│       └── tsconfig.json
├── docs/
│   ├── architecture.md
│   ├── deployment.md
│   └── api.md
├── .editorconfig
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── package.json
└── README.md
```

---

## 17. Engineering Decisions

### 1. Monorepo vs Polyrepo
- **Decision**: Monorepo (npm workspaces).
- **Why**: Allows enforcing uniform linting rules and sharing validation logic between frontend and backend.
- **Trade-offs**: Slightly larger initial setup time; CI/CD pipelines require intelligent caching to avoid rebuilding unchanged apps.

### 2. Next.js App Router vs Pages Router
- **Decision**: App Router.
- **Why**: It is the modern standard for Next.js, offering React Server Components (RSC) which dramatically reduces client-side JavaScript bundle sizes, improving SEO and performance.
- **Trade-offs**: Steeper learning curve for developers used to the older Pages router.

### 3. Layered Backend Architecture (Controller-Service-Repository)
- **Decision**: Strict 3-tier architecture.
- **Why**: Decouples business logic from framework-specific code (Express req/res). Makes unit testing services straightforward.
- **Trade-offs**: Requires creating more files initially (boilerplate).
- **Future Impact**: Massive positive impact. Swapping database systems or changing API frameworks (e.g., Fastify) becomes a matter of rewriting one layer, not the whole app.

### 4. HttpOnly Cookies for Refresh Tokens
- **Decision**: Store refresh tokens in secure HTTP-only cookies, access tokens in memory.
- **Why**: Best defense against Cross-Site Scripting (XSS) attacks stealing long-lived tokens.
- **Trade-offs**: Requires careful CORS configuration and credentials inclusion in Axios.

### 5. Cloudinary for Image Storage
- **Decision**: Offload image processing and storage to Cloudinary.
- **Why**: E-commerce relies heavily on images. Storing images on the VPS filesystem limits horizontal scaling. Cloudinary provides on-the-fly optimization and CDN delivery.
- **Trade-offs**: Vendor lock-in (mitigated by abstracting the storage service).

### 6. MySQL Database
- **Decision**: Relational DB (MySQL).
- **Why**: E-commerce data (Users, Orders, Products, Transactions) is highly structured and relational. ACID compliance is critical for payments and inventory.
- **Trade-offs**: Schema migrations require careful planning compared to NoSQL (MongoDB).

---
*This document is a living foundation and should be strictly adhered to during all phases of Weebster development.*
