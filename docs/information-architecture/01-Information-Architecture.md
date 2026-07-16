# Information Architecture - Weebster

This document outlines the overarching Information Architecture (IA) strategy for the Weebster e-commerce platform. It dictates how information is organized, structured, and presented to users to maximize discoverability and conversion.

---

## 1. Purpose & Scope
The purpose of this IA is to map the conceptual structure of the Weebster platform before UI design or backend routing begins. It acts as the blueprint for navigation, content hierarchy, and user journeys, ensuring that users can intuitively find what they need, whether they are a parent seeking a quick gift or a collector hunting for a specific action figure.

This architecture is strictly aligned with the principles defined in `Phase 1 (Engineering Foundation)` and `Phase 2 (Design System)`.

## 2. Architecture Principles
- **Predictability over Novelty:** E-commerce relies on established mental models. The cart is always top right; filters are always on the left (desktop) or a bottom drawer (mobile). We do not reinvent core e-commerce interactions.
- **Progressive Disclosure:** Users should not be overwhelmed with choices. We show primary categories first, allowing users to drill down into subcategories and filters only when necessary.
- **Mobile-First Hierarchy:** The most critical actions and navigations are prioritized for the mobile "Thumb Zone" (bottom of the screen). 
- **Flat over Deep:** The site architecture aims to be as shallow as possible. A user should be able to reach any product from the homepage in a maximum of 3 clicks (Home -> Category -> Product).

## 3. Business Goals & IA Alignment
| Business Goal | IA Strategy |
|---------------|-------------|
| **Sell Toys Online** | Prominent search bar, clear "Add to Cart" sticky CTAs, and frictionless checkout flow. |
| **Manage Inventory** | Segregated, dense data architecture in the Admin Dashboard, completely isolated from the customer storefront. |
| **Improve Brand Presence** | Dedicated, rich content pages (About, Trust/Policies) that are easily accessible via the footer. |

## 4. UX & Navigation Principles
- **Contextual Awareness:** The user must always know *where* they are in the site hierarchy. This is achieved via Breadcrumbs on all catalog pages.
- **Redundancy is Good:** Key destinations (like Categories or Cart) should be accessible via multiple paths (e.g., Top Nav, Bottom Mobile Nav, and Homepage Grids).
- **Search as a Primary Utility:** Because Weebster scales to 10,000+ products, global search is treated as a primary navigation tool, not an afterthought.

## 5. Scalability Strategy
The IA is designed to support the initial 50 products but structurally scales to 10,000+.
- **Category Taxonomies:** Categories are hierarchical (`Parent -> Child -> Grandchild`). We launch with 1 level (e.g., "Action Figures"), but the database and URL structures (`/category/action-figures/marvel`) support future depth.
- **Faceted Search (Filtering):** As product count grows, filtering replaces deep category trees. Users select "Action Figures" and filter by "Brand: Marvel" rather than navigating to a distinct "Marvel Action Figures" category page.

## 6. Maintainability Strategy
- **Decoupled Admin/Customer Contexts:** The Customer UI and Admin UI share zero navigation structures. They are treated as separate applications within the Next.js App Router (using Route Groups `(shop)` and `(admin)`).
- **SEO-Driven URLs:** URLs strictly reflect the IA hierarchy, making it easy for marketing teams to read and manage links without engineering intervention.

## 7. Future Expansion Strategy
The IA reserves specific "slots" for future modules without requiring a redesign:
- **Blog / Content Hub:** Can be attached to a `/blog` root route.
- **Loyalty Program:** Will exist as a sub-section within the `/dashboard/rewards` User Profile area.
- **Multi-Vendor:** The product data structure supports a `vendor_id`, which will eventually manifest as a "Sold By" filter in the existing filter architecture.
