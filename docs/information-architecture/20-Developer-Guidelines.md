# Developer Guidelines (IA & Routing) - Weebster

This document translates the Information Architecture into strict rules for the engineering team. All PRs must adhere to these constraints.

---

## 1. Routing & URL Rules
- **No Hardcoded Strings:** Never hardcode URLs in `href` tags (e.g., `<Link href="/product/marvel-toy">`). You must use a central `routes.ts` file or helper function if building complex dynamic URLs to ensure consistency if base paths change.
- **Query Params for State:** If a UI state needs to survive a page refresh (Filters, Pagination, Sorting), it MUST be stored in the URL query string, NOT in `useState`.
- **Next.js `<Link>`:** Always use the Next.js `<Link>` component for internal navigation to enable client-side routing and prefetching. Never use standard `<a>` tags for internal links.

## 2. Navigation State Rules
- **Active States:** Navigation menus (Sidebar, Header) must visually indicate the current active page. Use Next.js `usePathname()` hook to compare the current URL against the link's destination and apply an `--active` CSS class.
- **Prefetching:** Next.js prefetches links by default. Be cautious with grids containing 100+ product links, as prefetching all of them might overload the client's network. Disable prefetching on non-critical links: `<Link href="..." prefetch={false}>`.

## 3. SEO Constraints for Devs
- **Dynamic Metadata:** Every page file (`page.tsx`) MUST export a `generateMetadata()` function or a static `metadata` object. PRs without metadata for new pages will be rejected.
- **Semantic HTML:** Do not use `<div>` for buttons. Do not use `<h1>` just to make text large. Only ONE `<h1>` tag is permitted per page (usually the Product Title or Category Title).

## 4. Definition of Done (DoD) for New Pages
Before a new route (page) is considered complete, the developer must verify:
- [ ] Is it placed in the correct Route Group `(shop)` or `(admin)`?
- [ ] Does it have SEO metadata (Title, Description)?
- [ ] Is it mobile responsive (tested at 320px width)?
- [ ] Does it have a defined `loading.tsx` state (Skeleton)?
- [ ] Does it handle errors gracefully (API failure)?
- [ ] Can it be navigated via keyboard (Tab/Enter)?
- [ ] Is the URL fully kebab-case?

## 5. State Management Rules
- **Server State (Data):** Fetched directly in Server Components (Next.js App Router). Do not use Redux/Context to store catalog data globally.
- **Client State (UI):** Use React `useState` for ephemeral UI toggles (e.g., `isDrawerOpen`).
- **Global State (User/Cart):** Use React Context for the Shopping Cart and User Session, as these must be accessible from any component deep in the tree without prop-drilling.

## 6. API Proxying (Security)
- Frontend client components should rarely talk directly to the Node.js Express server.
- They should talk to Next.js Route Handlers (`/api/...`), which securely attach HttpOnly Cookies/JWTs, and then proxy the request to the Node backend. This ensures tokens are never exposed to cross-site scripting (XSS) in the browser's JavaScript memory.
