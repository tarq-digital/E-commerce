# Product Requirements Document (PRD)

## 1. Executive Summary
Weebster is a modern, premium toy store currently operating two physical outlets in Chhattisgarh, India. As part of a digital expansion strategy, Weebster is launching a state-of-the-art e-commerce platform designed to become its primary sales channel. The platform will cater to a diverse demographic, ranging from parents buying gifts to serious hobbyists and anime collectors. The initial catalog will launch with approximately 50 products but is architected to scale seamlessly to over 1000+ products without requiring a redesign or major architectural overhaul.

## 2. Business Goals & Vision
**Vision:** To become the premier destination for high-quality toys, collectibles, and hobbyist items in India, bridging the gap between a premium offline experience and a seamless digital storefront.

**Business Goals:**
1. Establish a high-converting, SEO-optimized digital storefront.
2. Transition the primary sales volume from offline outlets to the online platform within 12 months.
3. Provide an intuitive, premium, and fast user experience (UX) that reflects the brand's modern aesthetic.
4. Streamline inventory and order management across both physical and digital stores via a robust admin dashboard.

## 3. Objectives & KPIs
**Objectives:**
- Launch a responsive, mobile-first e-commerce website with a load time of under 2 seconds.
- Implement secure payment gateways (Razorpay) and robust user authentication.
- Achieve a highly scalable architecture using Next.js, Node.js, and MySQL.

**Key Performance Indicators (KPIs):**
- **Conversion Rate:** Target > 2.5% within the first 6 months.
- **Average Order Value (AOV):** Increase through strategic cross-selling and variant offerings.
- **Customer Acquisition Cost (CAC):** Lower through organic SEO and high Core Web Vitals scores.
- **Cart Abandonment Rate:** Target < 60% through a streamlined checkout process.
- **Uptime:** 99.99% availability.

## 4. User Personas
1. **The Parent (Priya, 34):** Looking for safe, high-quality, and trendy toys for her kids. Values clear specifications, easy navigation, and fast checkout.
2. **The Collector (Rahul, 26):** A serious Hot Wheels and anime figure collector. Values detailed images, zoom functionality, stock status accuracy, and variant selection.
3. **The Gift Buyer (Rohan, 40):** Needs to find age-appropriate gifts quickly. Relies heavily on advanced search, filters, and categories.
4. **The Teen/Anime Fan (Aisha, 17):** Looking for specific anime merchandise. Values aesthetic design, wishlists, and related product recommendations.

## 5. User Stories
### Customer Stories
- As a customer, I want to filter products by category, price, and stock status so I can quickly find what I need.
- As a collector, I want to see detailed specifications and multiple high-resolution images (with zoom) to verify product authenticity and details.
- As a returning customer, I want to save items to a wishlist for future purchases.
- As a user, I want a secure and fast checkout experience using Razorpay so my payment details are safe.
- As a customer, I want to track my order history and manage my delivery addresses from a centralized dashboard.

### Admin Stories
- As an admin, I want to add, edit, and delete products, including their variants, specifications, and images.
- As an admin, I want to monitor inventory levels and receive alerts for low stock to prevent overselling.
- As an admin, I want to manage banners and coupons to run promotional campaigns.
- As an admin, I want to view analytics (sales, top products, customer growth) to make informed business decisions.

## 6. Functional Requirements
### Main Website
- **Home Page:** Dynamic hero banner, Featured Products carousel, New Arrivals, Best Sellers, Categories grid, Offers section, Testimonials, Newsletter signup.
- **Shop & Navigation:** Advanced search (fuzzy search), Filters (price, category, availability), Sorting (price, popularity, newest), Pagination.
- **Product Details Page (PDP):** Multi-image gallery with zoom, variant selector (color, size, model), dynamic pricing based on variants, specifications table, related products, stock status indicator, "Add to Cart", "Add to Wishlist".
- **Cart & Checkout:** Persistent cart, dynamic tax/shipping calculation, Razorpay integration, coupon code application.
- **User Dashboard:** Secure JWT login, profile management, address book (multiple addresses), order history with statuses, wishlist management.

### Admin Dashboard
- **Overview:** High-level metrics, recent orders, low stock alerts.
- **Catalog Management:** Full CRUD for Products, Categories, and Variants.
- **Order Management:** View order details, update statuses (Pending, Processing, Shipped, Delivered, Cancelled).
- **Marketing:** Banner management (uploading via Cloudinary), Coupon creation (percentage/flat discount, expiry, usage limits).
- **Customers & Reviews:** View registered users, moderate product reviews (approve/hide).

## 7. Non-Functional Requirements
- **Performance:** Core Web Vitals optimized (LCP < 2.5s, FID < 100ms, CLS < 0.1). Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR) for fast catalog loading. Image optimization via Cloudinary.
- **Security:** HTTP-only cookies for JWT, bcrypt for passwords, Helmet for secure headers, rate limiting on APIs, protection against SQLi, XSS, and CSRF.
- **Scalability:** Node.js backend must handle concurrent requests efficiently. MySQL database normalized (3NF) to support scaling to 1000+ products without schema bottlenecks.
- **SEO & Accessibility:** WCAG 2.1 AA compliance, semantic HTML, dynamic Meta tags, Schema.org structured data.
- **Responsiveness:** Mobile-first approach, flawless execution on mobile, tablet, and desktop viewports.

## 8. Business Rules
- A product cannot be added to the cart if stock is 0.
- Coupons can only be applied once per order and must be within the valid date range.
- Users must be authenticated to access the checkout process (no guest checkout for initial launch to build customer base).
- Reviews can only be left by customers who have successfully purchased the specific product (Verified Purchase).

## 9. Acceptance Criteria
- **Website UI:** Renders perfectly across Chrome, Safari, Firefox, and Edge. Matches Figma designs exactly with premium, subtle animations. No Tailwind CSS used; only Vanilla CSS/CSS Modules.
- **Backend:** All API endpoints respond within 200ms (95th percentile).
- **Database:** Referential integrity maintained; no orphaned records upon category/product deletion.
- **Payments:** Successful Razorpay transactions reflect immediately in the database and user dashboard.

## 10. Future Roadmap
- **Phase 2 (0-500 Products):** Implement Elasticsearch or Algolia for advanced typo-tolerant search. Introduce a loyalty points system.
- **Phase 3 (500-1000+ Products):** Introduce a recommendation engine based on user browsing history. Implement multi-warehouse inventory management to handle dispatch from either of the two physical outlets.
- **Phase 4:** Mobile App (React Native) utilizing the same Node.js API backend.
