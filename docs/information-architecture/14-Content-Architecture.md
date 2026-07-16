# Content Architecture - Weebster

This document details the hierarchy and structure of the non-catalog content across the platform.

---

## 1. Homepage Hierarchy
The Homepage is a modular, vertically scrolling page designed to funnel users quickly into specific shopping categories.

1. **Global Header** (Nav, Search, Cart)
2. **Hero Banner Section** (Large 16:9 Image/Carousel, Primary CTA: "Shop the Marvel Collection")
3. **Category Grid** (Visual cards for 4-6 top-level categories: e.g., Action Figures, Puzzles, Board Games)
4. **Trending Products / Best Sellers** (Horizontal scrolling carousel of Product Cards)
5. **Brand Trust Banner** (Icons for "Free Shipping", "Authentic Products", "Secure Payment")
6. **New Arrivals** (Grid of 4-8 newly added products)
7. **Global Footer** (Links, Newsletter Signup)

## 2. Category Pages Hierarchy
1. **Breadcrumbs** (`Home > Action Figures`)
2. **Category Header** (H1 Title + Short descriptive text for SEO, e.g., "Discover premium action figures from Marvel, DC, and Anime universes.")
3. **Control Bar** (Mobile Filter Trigger + Desktop Sort Dropdown)
4. **Main Content Split:**
   - Left (Desktop): Faceted Filters
   - Right (Desktop): Product Grid
5. **Pagination**

## 3. Product Details Page (PDP) Hierarchy
1. **Breadcrumbs**
2. **Top Split:**
   - Left: Image Gallery (Main Image + Thumbnails)
   - Right: Product Metadata (Title, Price, Stock Status, Description, Add to Cart Button, Wishlist)
3. **Middle Section:** Specifications / Details (Accordion or Tabs containing Dimensions, Age Rating, Material)
4. **Bottom Section:** Related Products (Carousel)

## 4. Legal & Trust Pages (`/about`, `/privacy`, `/terms`)
- **Structure:** Clean, single-column text layouts restricted to `--container-md` (768px wide) for optimal reading line length.
- **Typography:** Uses standard Inter body text with clear `h2` and `h3` breakdowns.
- **Navigation:** Accessible exclusively via the Footer.

## 5. Future Content Hub (Blog/Articles)
*Planned for Phase 4 to boost organic SEO.*
- **Structure:** `/blog` (Index) -> `/blog/category/:slug` -> `/blog/:article-slug`
- **Integration:** Articles will feature embedded product cards (e.g., An article on "Top 10 Hot Wheels of 2026" will allow users to add the toys to their cart directly from the article).
