# Decision Log (Information Architecture)

This document records the major architectural decisions made during Phase 3, providing the rationale for *why* specific structures were chosen.

---

### Decision 1: Flat URL Structure for Products
- **Decision:** Product URLs will be `/product/[slug]` rather than `/category/[category-slug]/[product-slug]`.
- **Reason:** Many toys fit into multiple categories (e.g., a "Marvel" toy is both an "Action Figure" and "Collectibles"). If the category is in the URL, the same product exists on multiple URLs, causing SEO duplicate content penalties.
- **Alternatives Considered:** Canonicalizing one specific category path. Rejected because it creates overly complex routing logic.
- **Impact:** Easier maintenance, bulletproof SEO, simpler database queries.

### Decision 2: Separate Admin & Customer Contexts (Route Groups)
- **Decision:** The Admin dashboard and Customer storefront are completely separate Route Groups in Next.js (`(admin)` vs `(shop)`), sharing no layout files.
- **Reason:** Admin panels require dense data tables and sidebars; storefronts require marketing banners and mega-menus. Trying to force both into one global layout creates a massive, unmaintainable root layout file packed with `if(isAdmin)` logic.
- **Alternatives Considered:** A completely separate frontend repository for the Admin panel. Rejected because it violates the Monorepo strategy and duplicates component code (like Buttons and Inputs).
- **Impact:** Cleaner codebase, distinct loading strategies, improved security isolation.

### Decision 3: URL-Driven Filter State
- **Decision:** Category filters will modify the URL (e.g., `?brand=lego`) rather than relying on internal React State (e.g., `const [filters, setFilters]`).
- **Reason:** E-commerce users frequently share links to specific filtered views. If filters are local state, the link just sends them back to the unfiltered category.
- **Alternatives Considered:** React Context for filter state. Rejected because it breaks browser Back/Forward navigation.
- **Impact:** Server Components can instantly read the URL and fetch the correct data on the first pass, improving perceived performance.

### Decision 4: Mobile "Bottom Navigation" Standard
- **Decision:** The mobile view will use a fixed app-style Bottom Navigation Bar instead of a top Hamburger menu for primary navigation.
- **Reason:** Modern smartphones are too tall. Reaching the top-left corner requires a second hand. The bottom of the screen is the "Thumb Zone".
- **Alternatives Considered:** Traditional Top-Nav Hamburger. Rejected due to lower conversion rates in e-commerce testing.
- **Impact:** Higher engineering effort to manage scrolling behaviors so the bar doesn't block content, but significantly better UX and conversion.

### Decision 5: Next.js App Router over Pages Router
- **Decision:** Architecture is strictly designed for Next.js 13+ App Router.
- **Reason:** Server Components allow us to fetch database catalog data directly on the server without shipping massive JS bundles to the client, which is critical for mobile e-commerce performance.
- **Impact:** Requires a steeper learning curve for developers, but results in a faster, more SEO-friendly application.
