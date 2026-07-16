# Pages Architecture - Weebster

This document details the architectural layout, behavior, and design requirements for every page in the Weebster platform. All designs adhere to the mobile-first, app-like premium UX philosophy outlined in the `engineering_foundation.md` and `02-PRD.md`.

---

## Part 1: Customer Facing Pages

### 1. Home Page (`/`)
- **Purpose:** Serve as the premium storefront entry point, highlighting campaigns, new arrivals, and categories.
- **User Goal:** Quickly discover trending toys, navigate to specific categories, or be inspired by hero banners.
- **Desktop Layout:** Full-width hero carousel, grid-based featured categories (4 columns), horizontal scrolling trending products, standard footer. Top navigation bar.
- **Mobile Layout:** Edge-to-edge hero image. 2-column grid for categories. Horizontal swipeable product cards. **Bottom Navigation Bar** fixed at the bottom.
- **Sections:** Hero Banner Carousel, Shop by Category, Trending Now, Premium Collectibles, Trust Badges, Footer.
- **Components:** `HeroSlider`, `CategoryCard`, `ProductCard`, `TrustBadge`, `BottomNav` (Mobile only), `TopNav` (Desktop only).
- **Interactions:** Swipe to slide (mobile), hover to reveal secondary product image (desktop), click to navigate.
- **States:** Loading (Skeleton for products and hero), Error (Fallback banner), Empty (if no trending products).
- **SEO:** Title: "Weebster - Premium Toys & Collectibles", Meta Description highlighting premium brands and fast shipping. Canonical URL set to `/`.
- **Accessibility:** `aria-labels` on all slider controls, `alt` tags on all banners and product images. Focus trapping on navigation.
- **Responsive Behaviour:** Breakpoints at 768px (switch from Bottom Nav to Top Nav), 1024px (increase grid columns from 2 to 4).
- **Navigation:** Entry to `/shop`, `/categories`, and specific product pages.
- **Animations:** Fade-in on scroll for sections, subtle scale up (1.02x) on product card hover.

### 2. Shop / Product Listing Page (`/shop`)
- **Purpose:** Display the entire catalog with robust filtering and sorting.
- **User Goal:** Browse products, apply filters to find specific items, and add to cart/wishlist.
- **Desktop Layout:** Left sidebar for filters (Price, Category, In-stock), right side 3-column product grid.
- **Mobile Layout:** Full-width 2-column product grid. Sticky "Filter & Sort" floating button at the bottom (above Bottom Nav) that opens a full-screen drawer.
- **Sections:** Breadcrumbs, Active Filters pill-bar, Product Grid, Pagination/Infinite Scroll trigger.
- **Components:** `FilterSidebar` / `FilterDrawer`, `ProductCard`, `SortSelect`, `Pagination`.
- **Interactions:** Checkbox toggles for filters instantly update the grid (debounced). Add to wishlist via heart icon on cards.
- **States:** Loading (Grid of skeletons), Empty (No products match filter - show "Clear Filters" button).
- **SEO:** Title: "Shop Premium Toys | Weebster", Dynamic meta tags based on active category filter.
- **Accessibility:** Screen reader announcements when filters update the product count. Focus management for the filter drawer.
- **Responsive Behaviour:** Sidebar collapses into a bottom sheet/drawer on mobile.
- **Navigation:** Links to specific `/product/[slug]`.
- **Animations:** Staggered fade-in for product cards when loaded.

### 3. Product Details Page (`/product/[slug]`)
- **Purpose:** Provide comprehensive information about a single product to drive conversion.
- **User Goal:** Review images, check price/stock, read description, and add to cart.
- **Desktop Layout:** Left half: Sticky image gallery with thumbnails. Right half: Product info, price, Add to Cart block, accordion descriptions.
- **Mobile Layout:** Top full-width image swipeable gallery. Content flows vertically below. **Sticky "Add to Cart" bar** at the very bottom of the viewport.
- **Sections:** Image Gallery, Breadcrumbs, Product Header (Title, SKU), Pricing & Stock, Primary Actions, Details Accordion (Specs, Shipping).
- **Components:** `ImageGallery`, `QuantitySelector`, `AddToCartButton`, `WishlistButton`, `Accordion`.
- **Interactions:** Tap image to open full-screen lightbox. Select quantity. Click Add to Cart triggers cart drawer opening.
- **States:** Out of Stock (Button disabled, text changes to "Notify Me"), Loading (Skeleton text and gray box for images).
- **SEO:** Strict implementation of JSON-LD Product schema markup. Dynamic Title: "[Product Name] | Weebster".
- **Accessibility:** High contrast for pricing. Semantic `<h1>` for product title. `aria-expanded` on accordions.
- **Responsive Behaviour:** Image gallery switches from thumbnail grid to swipeable carousel on mobile.
- **Navigation:** Breadcrumb navigation back to shop/category.
- **Animations:** Micro-interaction (bounce) on the Add to Cart button when clicked.

### 4. Cart (Drawer / Slide-out)
- **Purpose:** Review selected items before checkout without leaving the current page.
- **User Goal:** Verify items, adjust quantities, view subtotal, proceed to checkout.
- **Desktop Layout:** Right-side slide-out drawer (approx 400px wide).
- **Mobile Layout:** Full-screen slide-up or slide-in from right.
- **Sections:** Header (Cart count, close button), Item List, Footer (Subtotal, Checkout Button).
- **Components:** `CartItem`, `QuantityAdjuster`, `RemoveButton`.
- **Interactions:** Click +/-, swipe left to remove item (mobile), click "Checkout".
- **States:** Empty Cart (Illustration + "Start Shopping" button), Loading (Updating quantity spinner).
- **SEO:** N/A (noindex).
- **Accessibility:** Trap focus inside the drawer when open. `aria-live` regions for subtotal updates.
- **Responsive Behaviour:** Takes full width on mobile, fixed width on desktop.
- **Navigation:** Proceeds to `/checkout`.
- **Animations:** Slide in from right. Cart items slide out when removed.

### 5. Checkout Page (`/checkout`)
- **Purpose:** Securely collect user address and trigger payment.
- **User Goal:** Complete the purchase as quickly and frictionlessly as possible.
- **Desktop Layout:** Split screen. Left: Address selection/form. Right: Sticky Order Summary.
- **Mobile Layout:** Single column stepper or continuous vertical flow. Order summary at the top (collapsed by default).
- **Sections:** Contact Info, Shipping Address, Payment Method, Order Summary.
- **Components:** `AddressList`, `AddressForm`, `OrderSummaryBox`, `RazorpayTrigger`.
- **Interactions:** Select existing address or add new. Click "Pay Now" to open Razorpay modal.
- **States:** Validation errors on form fields. Processing payment (Fullscreen loader).
- **SEO:** N/A (noindex).
- **Accessibility:** Strict form labeling. Clear error messages linked to inputs via `aria-describedby`.
- **Responsive Behaviour:** Order summary shifts above the form on mobile.
- **Navigation:** Redirects to `/order-confirmation` upon success.
- **Animations:** Smooth expansion of "Add New Address" form.

### 6. Authentication (Login / Register / Forgot Password)
- **Purpose:** Secure user identification.
- **User Goal:** Access account, view history, or checkout faster.
- **Desktop Layout:** Centered card over a branded background or split screen with lifestyle image.
- **Mobile Layout:** Full-screen form, minimal distractions.
- **Sections:** Form fields (Email, Password), Social Login (future-proofing), Links to alternate auth pages.
- **Components:** `FormInput`, `SubmitButton`, `AuthLayout`.
- **Interactions:** Inline validation on blur. Reveal password toggle.
- **States:** Loading (Button spinner), Error (Invalid credentials toast), Success (Redirect).
- **SEO:** N/A (noindex for register/forgot).
- **Accessibility:** `type="email"`, `type="password"`, `autocomplete` attributes properly set.
- **Responsive Behaviour:** Background image hides on mobile to save bandwidth.
- **Navigation:** Post-login redirect to previous page or Dashboard.
- **Animations:** Shake animation on the card if login fails.

### 7. User Dashboard & Nested Pages (`/dashboard/*`)
- **Purpose:** Central hub for customer account management.
- **User Goal:** Check order status, update addresses.
- **Desktop Layout:** Left sidebar navigation (Orders, Addresses, Profile), right content area.
- **Mobile Layout:** Top horizontal scrollable tabs or dropdown for navigation. Content flows below.
- **Sections:**
  - **Orders:** List of past orders with status badges (Pending, Shipped, Delivered).
  - **Addresses:** Grid of saved addresses with Edit/Delete actions.
- **Components:** `SidebarNav`, `OrderCard`, `AddressCard`, `StatusBadge`.
- **Interactions:** Click order for details, modal to add address.
- **States:** Empty states for no orders/addresses. Loading skeletons.
- **SEO:** N/A (noindex).
- **Accessibility:** Focus management for modals.
- **Responsive Behaviour:** Sidebar becomes a top tab-bar on mobile.
- **Navigation:** Internal dashboard routing.
- **Animations:** Fade transition between dashboard tabs.

---

## Part 2: Admin Facing Pages (`/admin/*`)

### 1. Admin Dashboard (`/admin/dashboard`)
- **Purpose:** Provide a high-level overview of business health.
- **User Goal:** View daily sales, pending orders, and out-of-stock items at a glance.
- **Desktop Layout:** Left fixed sidebar, top header (Admin profile/logout), main content area with metric cards and charts.
- **Mobile Layout:** Sidebar hidden behind a hamburger menu. Metric cards stack vertically.
- **Sections:** Metric KPI Cards (Revenue, Orders, Users), Recent Orders Table, Low Stock Alert List.
- **Components:** `AdminSidebar`, `MetricCard`, `DataTable`.

### 2. Products Management (`/admin/products`)
- **Purpose:** Manage catalog inventory.
- **User Goal:** Create, Read, Update, Delete products.
- **Layout:** Standard data table view with a "Create Product" button.
- **Sections:** Search/Filter bar, Paginated Table (Image, Name, SKU, Price, Stock, Actions).
- **Interactions:** Click row to edit. Toggle switch for "Active/Draft" status.

### 3. Product Create/Edit (`/admin/products/[id]`)
- **Purpose:** Data entry for catalog items.
- **Layout:** Multi-section form (Basic Info, Pricing, Media, Inventory).
- **Components:** `Dropzone` (for Cloudinary uploads), `RichTextEditor`, `Select` (for categories).
- **Validation:** Strict frontend validation (Price > 0, Stock >= 0, Image required).

### 4. Orders Management (`/admin/orders`)
- **Purpose:** Process customer orders.
- **Layout:** Data table optimized for fast status updates.
- **Interactions:** Bulk select to update status. Click order ID to view detailed manifest.

### 5. Banner Management (`/admin/settings/banners`)
- **Purpose:** Control homepage marketing elements without code changes.
- **Layout:** List of active banners with drag-and-drop ordering.
- **Components:** Image uploader, Link URL input, Status toggle.

---

### Global Architectural Notes
- **Sticky Actions:** On mobile, primary actions (Add to Cart, Checkout, Apply Filter) must *always* be fixed to the bottom of the screen for thumb accessibility.
- **Data Fetching:** Pages rely on Next.js Server Components for initial fast loads and SEO, falling back to Client Components only where interactive state (like Cart or Filters) is required.
- **Shadcn UI:** All components are built upon Shadcn UI primitives, ensuring high accessibility (Radix UI) and consistent styling via Tailwind CSS.
