# SEO Architecture - Weebster

This document details the strategies required to ensure Weebster ranks highly in search engines, maximizing organic traffic for product and category keywords.

---

## 1. Indexing Strategy

### Indexable Pages (Do-Index)
These pages are designed to be crawled and ranked by Google.
- **Homepage:** `/`
- **Category Pages:** `/category/[slug]`
- **Product Details Pages:** `/product/[slug]`
- **Static Content:** `/about`, `/contact`, `/terms`

### Non-Indexable Pages (No-Index)
These pages contain sensitive user data or duplicate content and must be blocked via `<meta name="robots" content="noindex">` and the `robots.txt` file.
- **Search Results:** `/search?q=...` (Prevents Google from indexing infinite variations of search queries).
- **Checkout Flow:** `/checkout`, `/checkout/success`
- **User Dashboard:** `/dashboard/*`
- **Admin Panel:** `/admin/*`
- **Authentication:** `/auth/*`

## 2. URL Parameter SEO Strategy (Filtering)
Faceted navigation can destroy an e-commerce site's SEO by creating millions of duplicate URLs (e.g., `?color=red`, `?color=blue`).
- **Rule:** Filter parameters appended to Category URLs (`/category/action-figures?brand=marvel`) MUST declare a canonical tag pointing back to the root category URL (`/category/action-figures`). We do not want Google indexing every specific filter combination unless we specifically generate a dedicated landing page for it.

## 3. Metadata Generation
Next.js `generateMetadata()` will be used to dynamically create title tags and meta descriptions.

### Product Pages
- **Title Tag format:** `[Product Name] | Buy Online | Weebster India` (Max 60 chars)
- **Meta Description:** Must be pulled from a specific `meta_description` column in the DB, falling back to the first 150 characters of the product description.
- **OpenGraph:** Must include the primary product image for social sharing.

### Category Pages
- **Title Tag format:** `Buy [Category Name] Toys Online | Weebster`
- **Meta Description:** Custom written description for each category.

## 4. Structured Data (JSON-LD)
Structured data helps Google understand the content, enabling Rich Snippets (showing price and stars directly in Google search results).
- **Product Pages:** Must inject `Product` schema containing Name, Image, Description, SKU, Brand, Offers (Price, Currency, Availability), and AggregateRating.
- **Category Pages:** Must inject `ItemList` schema.
- **All Pages:** Must inject `BreadcrumbList` schema so Google displays the site hierarchy in search results rather than raw URLs.

## 5. Local SEO Strategy
Since Weebster operates 2 physical stores in Chhattisgarh, India:
- The `/contact` or `/stores` page must include `LocalBusiness` JSON-LD schema with exact coordinates, opening hours, and addresses.
- The footer should mention "Visit our stores in Chhattisgarh".

## 6. Image SEO
- All Next.js `<Image>` tags must include a descriptive `alt` tag (e.g., `alt="Marvel Spider-Man Action Figure box front"`). Never use generic names like `alt="product"`.
- Images should be named semantically upon upload (e.g., `spider-man-action-figure.jpg` instead of `IMG_9042.jpg`).
