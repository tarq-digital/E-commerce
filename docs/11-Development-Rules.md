# Development & Architecture Rules - Weebster

This document establishes the strict rules of engagement for developers working on the Weebster platform. Adherence to these standards is non-negotiable and will be enforced via CI/CD pipelines and Code Reviews.

---

## 1. Architecture Rules

### 1.1 Backend: Strict Layer Separation
- **Controllers:** Must NEVER contain database queries (Prisma calls) or complex business logic. They are strictly responsible for parsing the request, calling a Service, and returning the response format.
- **Services:** Must contain all business logic. They should be ignorant of HTTP (do not pass `req` or `res` into a service). They throw `AppError` on failure.
- **Repositories:** Services must NEVER call Prisma directly. All database interactions happen in the Repository layer to allow easy swapping or testing of database logic.

### 1.2 Frontend: State Management
- **Server State:** Data fetched from the API (Products, Orders) must be managed by React Query / SWR or Next.js Server Components. Do not store API responses in global Zustand/Redux stores.
- **Client State:** UI state (Cart Drawer open/closed, current active filters) should be managed via URL parameters (preferred) or lightweight context (Zustand/React Context).
- **Component Fetching:** UI components (e.g., `<ProductCard>`) must NEVER make direct API calls. All fetching happens at the Page/Route level and is passed down via props.

## 2. Coding Standards

### 2.1 Typescript Rigidity
- **No `any`:** The use of `any` is strictly prohibited. Use `unknown` if a type is truly dynamic, and type-narrow it.
- **Interfaces vs Types:** Use `interface` for object definitions and contract blueprints. Use `type` for unions, intersections, and aliases.
- **Strict Mode:** `tsconfig.json` `strict: true` must remain enabled.

### 2.2 Error Handling
- **Backend:** 
  - Never use raw `try/catch` blocks in controllers. Wrap controller functions in a `catchAsync` utility.
  - Throw operational errors using the custom `AppError` class (e.g., `throw new AppError('Invalid email', 400)`).
  - The Global Error Handler middleware catches all errors, prevents server crashes, and formats the response.
- **Frontend:**
  - Every API call wrapper in the `services/` folder must intercept errors and return a standardized error object.
  - UI components must gracefully handle errors (e.g., show a Toast notification) rather than silently failing.

### 2.3 Validation
- **Backend:** ALL incoming request bodies, queries, and params must be validated using **Zod** middleware before reaching the controller.
- **Frontend:** ALL forms must be validated using **React Hook Form** + **Zod** resolver to match backend constraints before submission.

## 3. Git Workflow & Version Control

### 3.1 Branching Strategy (Git Flow)
- `main`: Production code. Locked. Deployments trigger from here.
- `development`: Integration branch. Locked.
- `feature/[name]`: Branched from `development`. Used for new features (e.g., `feature/cart-drawer`).
- `fix/[name]`: Branched from `development`. Used for non-critical bug fixes.
- `hotfix/[name]`: Branched from `main`. Used for critical production fixes. Merged into both `main` and `development`.

### 3.2 Commit Convention (Conventional Commits)
Commits must follow the Angular convention to enable automated changelog generation:
- `feat: added wishlist functionality`
- `fix: resolved race condition in checkout`
- `chore: updated dependencies`
- `docs: updated API specification`
- `style: formatted codebase`
- `refactor: moved auth logic to service layer`

### 3.3 Pull Request (PR) Requirements
- PRs must target the `development` branch (unless a hotfix).
- Code must pass all Husky pre-commit hooks (Prettier, ESLint).
- The PR description must link to a Jira/Linear ticket if applicable.
- Require at least 1 approval from a peer engineer.

## 4. Security & Performance Standards

### 4.1 Security Mandates
- **Secrets:** Never log passwords, tokens, or payment webhook secrets.
- **Injection:** Never use raw SQL queries. Always use Prisma ORM methods.
- **XSS:** React handles this by default, but never use `dangerouslySetInnerHTML` without DOMPurify validation.
- **Dependencies:** Run `npm audit` regularly. Do not introduce new packages without architectural review.

### 4.2 Performance Mandates
- **Frontend Images:** All images must use the Next.js `<Image>` component. Provide `width` and `height` to prevent Cumulative Layout Shift (CLS).
- **N+1 Problem:** Backend repositories must utilize Prisma's `include` carefully. Avoid fetching related data in a loop.
- **Bundle Size:** Do not import entire libraries (e.g., `import * from 'lodash'`). Import specific functions (`import debounce from 'lodash/debounce'`).

## 5. Review Checklist (Code Reviewer Responsibilities)
Before approving a PR, reviewers must verify:
- [ ] Does this code follow the Controller-Service-Repository architecture?
- [ ] Are all new API endpoints documented?
- [ ] Is input validation robust and present on both frontend and backend?
- [ ] Are edge cases handled (e.g., what if the database times out?)?
- [ ] Does the UI scale correctly down to a 375px mobile screen?
- [ ] Are there any console.logs or debugging statements left in the code?
- [ ] Is the code DRY (Don't Repeat Yourself), or should parts be extracted to a utility function?
