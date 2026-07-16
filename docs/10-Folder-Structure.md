# Folder Structure - Weebster

This document expands upon the `engineering_foundation.md` by detailing the precise, file-level organization of the Weebster monorepo. Maintaining this structure is critical for project scalability, team collaboration, and agency reusability.

---

## 1. Monorepo Root (`weebster-monorepo/`)
The root directory acts as the orchestrator. Business logic does not live here.
```text
weebster-monorepo/
├── apps/               # Contains deployable applications
├── packages/           # Contains shared libraries and configuration
├── docs/               # Technical documentation (PRD, APIs, Guidelines)
├── scripts/            # Build, deploy, and seed scripts
├── .github/            # GitHub Actions (CI/CD pipelines, templates)
├── .husky/             # Git hooks (pre-commit, commit-msg)
├── .editorconfig       # Standardized IDE rules
├── .gitignore
├── package.json        # Workspace configuration (npm workspaces)
└── README.md           # Project onboarding guide
```

---

## 2. Shared Packages (`packages/`)
Code shared between frontend and backend to maintain absolute consistency.
```text
packages/
├── config/
│   ├── eslint-preset.js      # Global linting rules
│   └── prettier-preset.json  # Global formatting rules
├── types/
│   ├── index.ts              # Export index
│   ├── user.ts               # Shared User interfaces
│   └── product.ts            # Shared Product interfaces
└── ui/                       # (Future) Reusable React components for Admin/Mobile apps
```

---

## 3. Frontend Application (`apps/frontend/`)
Next.js 14+ App Router implementation.

### A. Core Configuration
```text
apps/frontend/
├── public/             # Static assets (favicons, robots.txt, placeholder images)
├── .env.example        # Next.js environment template (NEXT_PUBLIC_...)
├── next.config.mjs     # Webpack, redirect, and image domain configs
├── package.json
├── tailwind.config.js  # Theme tokens referencing globals.css variables
└── tsconfig.json       # Path aliases (@/*) and strict types
```

### B. Application Routing (`src/app/`)
Uses Route Groups `(folder)` to share layouts without affecting the URL path.
```text
apps/frontend/src/app/
├── (shop)/             # Customer-facing storefront
│   ├── layout.tsx      # Includes Navbar and Footer
│   ├── page.tsx        # Homepage
│   ├── shop/           # /shop
│   ├── product/        # /product/[slug]
│   └── cart/           # /cart
├── (auth)/             # Authentication flows
│   ├── layout.tsx      # Minimal layout (No navbar/footer)
│   ├── login/          # /login
│   └── register/       # /register
├── (checkout)/         # Checkout flow
│   ├── layout.tsx      # Secure checkout layout
│   └── checkout/       # /checkout
└── globals.css         # Tailwind directives and CSS variables
```

### C. Component Architecture (`src/components/`)
Components are strictly categorized by domain.
```text
apps/frontend/src/components/
├── ui/                 # shadcn/ui generic primitives (Button, Input, Modal)
├── layout/             # Structural components (Navbar, Footer, Sidebar)
├── features/           # Complex, domain-specific components
│   ├── product/        # ProductCard, ImageGallery, ReviewStars
│   ├── cart/           # CartDrawer, CartItem
│   └── checkout/       # AddressForm, OrderSummary
└── providers/          # React Context wrappers (ThemeProvider, AuthProvider)
```

### D. Logic & Utilities
```text
apps/frontend/src/
├── hooks/              # Custom React hooks (useCart, useDebounce, useMediaQuery)
├── services/           # API interaction layer (Axios wrappers, strict types)
│   ├── auth.service.ts
│   └── api.ts          # Base Axios instance with interceptors
├── lib/                # Third-party initializations (utils.ts for tailwind-merge)
└── constants/          # Static data (ROUTES, ERROR_MESSAGES)
```

---

## 4. Backend Application (`apps/backend/`)
Express.js layered architecture.

### A. Core Configuration
```text
apps/backend/
├── prisma/             
│   ├── schema.prisma   # Database schema definition
│   └── migrations/     # Auto-generated SQL migration files
├── .env.example        # Database URLs, JWT secrets, Razorpay keys
├── package.json
└── tsconfig.json
```

### B. Source Code (`src/`)
```text
apps/backend/src/
├── index.ts            # Entry point. Initializes Express and starts server.
├── app.ts              # Express app setup (Middlewares, routes binding)
├── config/             # Environment validation and third-party setups
│   ├── env.ts          # Zod validation for process.env
│   ├── logger.ts       # Winston configuration
│   └── razorpay.ts     # Razorpay instance setup
├── api/                # HTTP Layer
│   ├── routes/         # Route definitions (e.g., auth.routes.ts)
│   ├── controllers/    # Req/Res handlers (e.g., auth.controller.ts)
│   └── validators/     # Zod schemas for request payloads
├── services/           # Core Business Logic (Framework agnostic)
│   ├── auth.service.ts # Password hashing, token generation
│   ├── order.service.ts# Status updates, Razorpay verification
│   └── email.service.ts# Sending order confirmations
├── repositories/       # Database abstraction layer (Prisma calls)
│   ├── user.repo.ts
│   └── product.repo.ts
├── middlewares/        # Express request interceptors
│   ├── auth.middleware.ts # Verifies JWT
│   ├── role.middleware.ts # Verifies ADMIN role
│   └── error.middleware.ts# Global exception handler
└── utils/              # Pure helper functions
    ├── AppError.ts     # Custom error class
    └── catchAsync.ts   # Wrapper to eliminate try/catch blocks in controllers
```

---

## 5. Agency Reusability & Naming Conventions
To ensure this boilerplate can be reused for future clients:
- **No Hardcoded Brand Names:** "Weebster" should never appear in UI components or error messages. Use `NEXT_PUBLIC_APP_NAME` from `.env`.
- **Theme Segregation:** All branding (colors, fonts, logos) must live exclusively in `globals.css`, `tailwind.config.js`, and the `public/` directory. Business logic must never reference specific brand colors.
- **Naming Conventions:** Folders in `src/` must be `kebab-case`. Files exporting React components must be `PascalCase`. Files exporting utilities or services must be `camelCase`.
