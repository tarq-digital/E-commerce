# Comprehensive Testing Checklist

## 1. Unit & Integration Testing
*Tools: Jest, React Testing Library, Supertest*

- [ ] **Components:** Verify all UI components render without crashing.
- [ ] **State Management:** Ensure Cart Context updates correctly when items are added/removed.
- [ ] **Calculations:** Validate that cart subtotal, tax, and discount (coupon) calculations are mathematically accurate.
- [ ] **API Endpoints:** Test all CRUD operations (Create, Read, Update, Delete) on Products and Categories.
- [ ] **Database Queries:** Ensure complex joins (e.g., getting a product with its variants and images) return the expected JSON structure.

## 2. User Interface (UI) & Cross-Browser Testing
- [ ] **Responsive Design:** Manually verify layout on Mobile (320px, 375px), Tablet (768px), and Desktop (1024px+).
- [ ] **Browsers:** Test functionality on Chrome, Firefox, Safari (macOS/iOS), and Edge.
- [ ] **Hover States:** Ensure all buttons, links, and product cards have visible, smooth hover states.
- [ ] **Modals/Drawers:** Verify that background scroll is disabled when a modal (or cart drawer) is open, and `ESC` key closes it.
- [ ] **Images:** Verify images maintain aspect ratio without distortion and that Cloudinary URLs are loading.

## 3. Authentication & Security Testing
- [ ] **Registration:** Ensure duplicate emails cannot register.
- [ ] **Login:** Validate JWT generation and HTTP-Only cookie setting.
- [ ] **Access Control:** Attempt to access `/admin/*` routes as a standard customer; verify 403 Forbidden response.
- [ ] **JWT Expiry:** Verify user is prompted to log in again once the token expires.
- [ ] **XSS/SQLi:** Test input fields (Search, Login) with basic script tags and SQL injection strings to ensure sanitization.

## 4. Payment Flow (Razorpay) Testing
*Use Razorpay Test Mode credentials.*

- [ ] **Success Flow:** Complete a transaction; verify order status changes to "Paid" and cart clears.
- [ ] **Failure Flow:** Intentionally fail a payment; verify user is shown an error and order remains "Pending".
- [ ] **Webhook Validation:** Ensure the backend properly verifies the Razorpay signature before updating the database.
- [ ] **Stock Deduction:** Ensure inventory is deducted *only* after successful payment verification.

## 5. Cart & Wishlist Testing
- [ ] **Out of Stock:** Attempt to add an out-of-stock item to the cart; verify UI prevents it.
- [ ] **Quantity Limits:** Ensure user cannot add more items than are currently in stock.
- [ ] **Persistence:** Add items to cart, refresh page; verify items remain in cart.
- [ ] **Wishlist:** Verify authenticated users can save and remove items from wishlist.

## 6. Admin Panel Testing
- [ ] **Product Management:** Add a product with multiple variants and images. Update it. Delete it.
- [ ] **Image Upload:** Verify images upload to Cloudinary and return valid URLs.
- [ ] **Order Management:** Change an order status from "Pending" to "Shipped"; verify the user dashboard reflects this change.
- [ ] **Coupon Limits:** Test a coupon with a "usage limit of 1". Apply it twice; verify the second attempt fails.

## 7. Performance & SEO Testing
- [ ] **Lighthouse Audit:** Run Chrome Lighthouse. Target scores: Performance > 90, SEO > 95, Accessibility > 95.
- [ ] **Core Web Vitals:** Ensure LCP (Largest Contentful Paint) is < 2.5 seconds on mobile 4G.
- [ ] **Meta Tags:** View page source on a Product Page to ensure dynamic `<title>`, `<meta description>`, and Open Graph tags are populated.
- [ ] **Console Errors:** Ensure no React hydration errors or console warnings exist in production build.

## 8. Pre-Launch Final Verification
- [ ] SSL Certificate valid (`https://weebster.in`).
- [ ] Razorpay API keys swapped to **LIVE** mode.
- [ ] Admin password changed from default.
- [ ] Dummy/Test products and orders deleted from the database.
