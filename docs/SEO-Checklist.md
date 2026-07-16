# SEO & Discoverability Checklist

## 1. Technical SEO (Next.js Implementation)
- [ ] **Server-Side Rendering (SSR):** Ensure product pages and category pages use Server Components so search engines crawl fully rendered HTML.
- [ ] **SEO-Friendly URLs:** Use clean slugs (e.g., `weebster.in/shop/action-figures/naruto-uzumaki`) instead of IDs.
- [ ] **Canonical Tags:** Ensure every page has a `<link rel="canonical" href="..." />` to prevent duplicate content issues.
- [ ] **robots.txt:** Automatically generated to allow crawling of `/shop` but disallow `/admin`, `/checkout`, and `/account`.
- [ ] **sitemap.xml:** Dynamic generation of sitemap containing all active products and categories.
- [ ] **404 Page:** Custom, styled "Page Not Found" with links back to popular categories.

## 2. On-Page SEO
- [ ] **Dynamic Meta Titles:** Format: `[Product Name] | Weebster Toys & Collectibles`.
- [ ] **Meta Descriptions:** Unique, keyword-rich descriptions for every product (e.g., "Buy authentic Naruto action figures online at Weebster...").
- [ ] **H1 Tags:** Strictly ONE `<h1>` tag per page (usually the Product Title or Category Name).
- [ ] **Heading Hierarchy:** Logical use of `<h2>` and `<h3>` for specifications, reviews, and related products.

## 3. Schema.org Structured Data (JSON-LD)
Injected via Next.js `<Script>` tags in the document head.
- [ ] **Product Schema:** Includes Name, Image, Description, SKU, Price, Currency, and Availability (InStock/OutOfStock). Crucial for Google Shopping tabs.
- [ ] **Breadcrumb Schema:** Helps Google understand site structure (e.g., Home > Shop > Action Figures > Naruto).
- [ ] **Organization Schema:** Defines Weebster as a brand, linking to social profiles and customer service contacts.
- [ ] **Local Business Schema:** Highlights the 2 physical outlets in Chhattisgarh, including addresses, opening hours, and phone numbers.

## 4. Open Graph & Social Cards
- [ ] **Open Graph (og:):** `og:title`, `og:description`, `og:image` implemented for sharing on Facebook/WhatsApp.
- [ ] **Twitter Cards:** `twitter:card="summary_large_image"` implemented for rich previews on X.

## 5. Image SEO
- [ ] **Alt Attributes:** Descriptive alt text on all product images (e.g., `alt="Bandai Naruto Uzumaki Action Figure Front View"`).
- [ ] **Next/Image Optimization:** Use Next.js `<Image />` component for automatic WebP conversion, resizing, and lazy loading.
- [ ] **File Names:** Ensure uploaded images have descriptive names before saving to Cloudinary (e.g., `naruto-figure-front.jpg` instead of `IMG_1234.jpg`).

## 6. Core Web Vitals (Performance)
- [ ] **LCP (Largest Contentful Paint):** Ensure the hero image or main product image loads quickly by using `priority={true}` in Next.js `<Image>`.
- [ ] **CLS (Cumulative Layout Shift):** Specify explicit width/height for all images to prevent the page from jumping as assets load.
- [ ] **FID (First Input Delay):** Minimize main-thread blocking JavaScript. Keep the bundle size small.

## 7. Next-Gen / AI Search Discoverability
- [ ] **llms.txt:** Create an `llms.txt` file at the root providing a markdown summary of the Weebster catalog, business details, and policies for AI web scrapers (ChatGPT, Claude, Perplexity).
- [ ] **humans.txt:** Include a `humans.txt` to credit the development team and provide contact info.

## 8. Post-Launch Actions
- [ ] Submit `sitemap.xml` to **Google Search Console**.
- [ ] Set up **Google Analytics 4 (GA4)** for tracking traffic and conversions.
- [ ] Create/Update **Google My Business** profiles for the 2 physical outlets in Chhattisgarh, linking back to the new website.
