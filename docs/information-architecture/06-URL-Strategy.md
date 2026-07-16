# URL Strategy - Weebster

This document dictates the structure of URLs across the platform. A clean URL strategy is vital for SEO, user sharing, and analytical tracking.

---

## 1. General Principles
- **Kebab-Case:** All URLs must strictly use lowercase letters and hyphens (e.g., `/action-figures`, not `/Action_Figures`).
- **No File Extensions:** URLs must not contain `.html` or `.php`.
- **Trailing Slashes:** We standardize on NO trailing slashes. Next.js will automatically redirect `/about/` to `/about`.

## 2. Semantic URL Hierarchy

### Catalog Routes
- **Shop All:** `/shop`
- **Category:** `/category/[category-slug]` (e.g., `/category/marvel`)
  - *Future Sub-categories:* `/category/[parent-slug]/[child-slug]`
- **Product:** `/product/[product-slug]` (e.g., `/product/iron-man-mark-50`)
  - *Why not `/category/marvel/iron-man`?* Products often belong to multiple categories. Using a flat `/product/` root prevents duplicate content issues (SEO penalty) and simplifies canonical tags.

### Static / Marketing Routes
- `/about`
- `/contact`
- `/privacy`
- `/faq`

### User Routes
- `/login`
- `/register`
- `/dashboard`
- `/dashboard/orders`
- `/dashboard/orders/[order-id]` (e.g., `/dashboard/orders/WB-100452`)

## 3. Query Parameter Strategy (Filtering & Sorting)
For dynamic lists (like the Shop page), we use URL search parameters instead of nested paths. This allows users to bookmark or share exact filter states.

- **Sorting:** `?sort=price-asc`, `?sort=newest`
- **Pagination:** `?page=2` (Never use `?page=1`, just use the base URL).
- **Filtering (Single):** `?brand=lego`
- **Filtering (Multiple):** `?brand=lego,hasbro` or `?brand=lego&brand=hasbro` (Depending on backend parser configuration; comma-separated is cleaner for URLs).
- **Search:** `/search?q=action+figures`

## 4. Canonical & SEO Rules
- **Canonical Tags:** Every page MUST declare a canonical URL to prevent duplicate content indexing. For example, if a user visits `/product/iron-man?ref=facebook`, the `<link rel="canonical" href="https://weebster.in/product/iron-man" />` must be injected into the `<head>`.
- **Pagination Canonical:** Page 2 (`?page=2`) must set its canonical URL to itself, ensuring Google indexes pagination correctly.

## 5. Redirect Strategy
- **301 (Permanent Redirect):** If an old product slug changes, or a category is deleted and merged, the server must issue a 301 redirect from the old URL to the new one to preserve SEO juice.
- **302 (Temporary Redirect):** Used for authentication flows (e.g., redirecting an unauthenticated user from `/checkout` to `/login?redirect=/checkout`).
