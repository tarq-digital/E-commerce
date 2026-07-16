# Sitemap - Weebster

This document maps the complete page hierarchy for the Weebster platform. It acts as the master visual index for all accessible routes.

---

## 1. Customer Website (Public & Protected)

```mermaid
graph TD
    Home[Home /] --> Shop[Shop /shop]
    Home --> Categories[Categories /categories]
    Home --> Search[Search /search?q=]
    Home --> Policies[Legal & Policies]
    
    %% Shop Flow
    Shop --> ProductDetail[Product Detail /product/:slug]
    Categories --> CategoryListing[Category Listing /category/:slug]
    CategoryListing --> ProductDetail
    
    %% Cart & Checkout
    Home -.-> Cart[Cart Drawer]
    ProductDetail -.-> Cart
    Cart --> Checkout[Checkout /checkout]
    Checkout --> OrderSuccess[Order Success /checkout/success]
    
    %% Authentication & User Dashboard
    Home --> Auth[Login/Register /auth]
    Auth --> Dashboard[User Dashboard /dashboard]
    Dashboard --> Orders[My Orders /dashboard/orders]
    Dashboard --> Addresses[Saved Addresses /dashboard/addresses]
    Dashboard --> Wishlist[Wishlist /dashboard/wishlist]
    
    %% Static Pages
    Policies --> About[About Us /about]
    Policies --> Contact[Contact /contact]
    Policies --> Terms[Terms & Conditions /terms]
    Policies --> Privacy[Privacy Policy /privacy]
```

## 2. Admin Dashboard (Protected)

```mermaid
graph TD
    AdminLogin[Admin Login /admin/login] --> AdminRoot[Admin Dashboard /admin]
    
    AdminRoot --> AdminProducts[Products /admin/products]
    AdminProducts --> ProductCreate[Create Product /admin/products/new]
    AdminProducts --> ProductEdit[Edit Product /admin/products/:id]
    
    AdminRoot --> AdminCategories[Categories /admin/categories]
    AdminCategories --> CategoryCreate[Create Category /admin/categories/new]
    
    AdminRoot --> AdminOrders[Orders /admin/orders]
    AdminOrders --> OrderDetail[Order Details /admin/orders/:id]
    
    AdminRoot --> AdminUsers[Customers /admin/users]
    AdminRoot --> AdminSettings[Store Settings /admin/settings]
    AdminSettings --> Banners[Banner Management /admin/settings/banners]
```

## 3. Dynamic Pages Strategy
Pages generated dynamically based on database content:
- `/product/:slug`: Next.js `generateStaticParams` / ISR for product pages to ensure fast load times and SEO indexing.
- `/category/:slug`: Category listing pages.
- `/search`: Purely dynamic (Server-Side Rendered or Client-Side fetched) based on query parameters.

## 4. Future Expansion Pages
*These are mapped out to ensure the current IA does not block future roadmap items.*
- `/blog`: Content marketing hub.
- `/brands/:brand_slug`: Specific landing pages for partner brands (e.g., Lego, Hot Wheels).
- `/dashboard/wallet`: Future loyalty and rewards tracking.
- `/admin/inventory`: Advanced warehouse-level stock management.
