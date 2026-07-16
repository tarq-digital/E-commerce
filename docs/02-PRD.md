# Product Requirements Document (PRD) - Weebster

## 1. Project Vision
Weebster aims to be the premier destination for premium toys, collectibles, and hobbyist items in India. Currently operating out of two physical outlets in Chhattisgarh, the brand is expanding digitally to capture the growing D2C (Direct-to-Consumer) e-commerce market. The digital platform will bridge the gap between a high-end offline shopping experience and a seamless, high-performance digital storefront. The architecture and UX must reflect a premium brand, offering speed, elegance, and extreme reliability.

This platform will not only serve as a sales channel but also act as the foundational reusable e-commerce boilerplate for future agency projects. Therefore, its architecture must be modular, scalable, and highly adaptable.

## 2. Business Goals
1. **Digital Transformation:** Successfully transition the primary sales volume from offline outlets to the online platform within 12 months.
2. **Premium Brand Positioning:** Establish a high-converting, mobile-first digital storefront that reflects the brand's premium identity through minimal, elegant, and fast UI/UX.
3. **Scalability:** Build a foundation capable of supporting an initial catalog of 50 products and scaling seamlessly to 10,000+ products without architectural overhauls.
4. **Agency Boilerplate:** Create a production-ready, white-label e-commerce template where future clients require only branding and product changes.
5. **Operational Efficiency:** Streamline order management, inventory tracking, and user management through a robust admin dashboard.

## 3. Objectives
- Launch a responsive, mobile-first e-commerce platform with a load time of under 2 seconds.
- Implement secure payment gateways (Razorpay) and robust user authentication (JWT).
- Achieve a highly scalable architecture using Next.js (App Router), Node.js (Express), MySQL, and Prisma ORM.
- Deliver an app-like mobile experience with bottom navigation, sticky CTAs, and thumb-friendly interactions.

## 4. Target Audience
- **Parents (Ages 28-45):** Looking for high-quality, safe, and premium toys for their children. Value fast checkout, clear product descriptions, and reliability.
- **Hobbyists & Collectors (Ages 18-35):** Seeking rare, high-end collectibles, anime figures, and hobby kits. Value detailed images, exact specifications, and wishlists.
- **Gift Buyers (Ages 18-50):** Looking for premium gifting options. Value easy navigation, categorized search, and premium packaging options.

## 5. User Personas
### Persona 1: The Discerning Parent (Aditi, 34)
- **Profile:** Working professional, mother of two.
- **Goals:** Wants to buy safe, premium educational toys quickly.
- **Pain Points:** Hates slow websites and complicated checkout processes.
- **Platform Needs:** Mobile-first design, fast search, guest checkout, reliable delivery tracking.

### Persona 2: The Serious Collector (Rahul, 26)
- **Profile:** Software engineer, anime enthusiast.
- **Goals:** Wants to purchase authentic, limited-edition action figures.
- **Pain Points:** Poor image quality, lack of product details, stockouts.
- **Platform Needs:** High-res image galleries (Cloudinary), wishlist functionality, precise category filtering.

## 6. Success Metrics
- **Conversion Rate:** Target > 2.5% within the first 6 months of launch.
- **Average Order Value (AOV):** Increase through intuitive UX and related product suggestions (future scope).
- **Core Web Vitals:** Achieve > 90 score on Google PageSpeed Insights (Mobile & Desktop).
- **Mobile Traffic Share:** Target > 75% of total sales via mobile devices, validating the mobile-first design philosophy.
- **Cart Abandonment Rate:** Maintain below 60% through a frictionless, single-page-like checkout experience.

## 7. Version Scope (Version 1.0)
This version focuses strictly on core e-commerce functionalities required for a premium D2C brand.

### Included in V1:
- **Customer Facing:** Home, Shop (Catalog), Categories, Search, Product Details, Wishlist, Cart, Checkout, Login/Register (JWT), Forgot Password, User Dashboard (Orders, Addresses), Contact Page.
- **Admin Facing:** Secure Dashboard, Product Management, Category Management, Order Management, User Management, General Settings, Banner Management.
- **Integrations:** Razorpay (Payments), Cloudinary (Media Storage).

## 8. Feature List
### Customer Features
- **Authentication:** Email/Password registration, Login, JWT-based session management, Password reset.
- **Browsing:** Category navigation, Keyword search, Product listing with pagination/infinite scroll.
- **Product Experience:** High-quality image galleries, pricing, stock status, descriptions.
- **Cart & Wishlist:** Persistent cart (local storage/DB sync), Add to wishlist.
- **Checkout:** Address management, Order summary, Razorpay integration, Order confirmation.
- **User Account:** View order history, track order status, manage saved addresses.

### Admin Features
- **Dashboard:** High-level metrics (Total sales, pending orders, user count).
- **Product Management:** CRUD operations for products (Title, description, price, stock, images, category).
- **Order Management:** View orders, update order status (Pending, Processing, Shipped, Delivered, Cancelled).
- **Banner Management:** Update homepage hero banners for marketing campaigns.

## 9. Out of Scope (For V1)
*Do NOT implement these in Version 1. They are reserved for future phases.*
- Coupons & Discounts
- Referral & Affiliate Programs
- Wallet & Loyalty Points
- Product Reviews & Ratings
- Blog & Content Management
- AI Search & Recommendations
- Subscription Services
- Email Marketing & WhatsApp Automation
- Advanced Analytics Dashboards
- Multi-Vendor Support

## 10. Business Requirements
- **Payment Processing:** Must support Indian payment methods (UPI, Cards, Netbanking) exclusively via Razorpay.
- **Media Delivery:** All product images must be optimized and served via a CDN (Cloudinary) to ensure sub-2-second load times.
- **Mobile Experience:** The mobile web version must mimic a native application (App-like UX, bottom navigation).
- **Reusability:** The codebase must be strictly decoupled from Weebster-specific business logic where possible, allowing the agency to reuse the repo for future clients by only changing ENV variables and styling tokens.

## 11. Functional Requirements
- **Authentication:** Passwords must be hashed using `bcrypt`. JWTs must be securely handled (HttpOnly cookies for refresh tokens, memory for access tokens).
- **Database:** Must use MySQL with Prisma ORM for type-safe database interactions and schema migrations.
- **Cart:** Cart data must be preserved across sessions for logged-in users.
- **Order Flow:** Once an order is placed and payment is verified via Razorpay webhooks, stock must be automatically deducted.

## 12. Non-Functional Requirements (NFRs)
- **Performance:** First Contentful Paint (FCP) < 1.5s, Time to Interactive (TTI) < 2.5s on 4G networks.
- **Security:** Protection against SQL Injection (via Prisma), XSS, CSRF. Implementation of Rate Limiting and Helmet.js on the Express backend.
- **Scalability:** The Express backend must follow a layered architecture (Controller-Service-Repository) to allow future microservice extraction.
- **Maintainability:** Strict enforcement of ESLint, Prettier, and conventional commits. Maximum file and function size limits must be observed.

## 13. Project Constraints
- **Hosting:** Deployment is restricted to Hostinger Business Node.js Hosting. Architecture must account for VPS limitations compared to auto-scaling serverless environments.
- **Technology Stack:** Strictly Next.js, Express, MySQL, Prisma, CSS Modules, Global CSS. No deviations to other frameworks (e.g., NestJS, MongoDB, Tailwind) are permitted.

## 14. Acceptance Criteria
- [ ] Users can successfully register, log in, and manage their profile.
- [ ] Users can browse products, add them to the cart, and proceed to checkout.
- [ ] Payments are successfully captured via Razorpay and reflected in the database.
- [ ] Admin can perform CRUD operations on products and categories.
- [ ] Admin can view and update order statuses.
- [ ] The mobile experience includes bottom navigation and app-like interactions.
- [ ] Lighthouse scores for Performance, Accessibility, Best Practices, and SEO are all above 90.
- [ ] The codebase adheres strictly to the `engineering_foundation.md` architecture.
