# UI/UX Guidelines - Weebster

This document dictates the specific interaction models, user experience patterns, and accessibility standards for Weebster. These guidelines ensure the platform feels like a cohesive, premium native application rather than a disjointed website.

---

## 1. Mobile Experience (M-Commerce First)
The vast majority of traffic will be mobile. The mobile experience must never feel like a "scaled-down" desktop site.

### The "Thumb Zone" Rule
- **Action Placement:** All critical actions (Add to Cart, Checkout, Apply Filters, Next Step) must be located in the bottom 30% of the screen.
- **Reachability:** Users must be able to complete a purchase holding the phone in one hand using only their thumb.

### Mobile Navigation
- **Bottom Navigation Bar:** Replaces the desktop top header for primary navigation. 
  - Tabs: Home, Shop, Wishlist, Cart, Profile.
  - The currently active tab icon must be filled/highlighted.
- **Hide on Scroll:** The Bottom Nav bar translates down (hides) when scrolling down to maximize screen real estate, and immediately translates up (reappears) on any upward scroll.

### Mobile Drawers (Bottom Sheets)
- **Avoid Modals:** Standard center-screen popup modals are banned on mobile.
- **Use Drawers:** Filters, Cart review, and Address selection must open as a Drawer sliding up from the bottom of the screen, dimming the background. They must be swipeable to close.

## 2. Desktop & Tablet Experience
- **Hover States:** Crucial for desktop. Every clickable element must have a distinct hover state (color change, subtle scale, or underline) to communicate interactivity.
- **Mega Menus:** Category navigation on desktop should use a rich dropdown mega-menu, displaying top sub-categories and a promotional image.
- **Sticky Elements:** The Order Summary box during checkout and the Product Info block on the Product Details page must be `sticky top-4` as the user scrolls past long descriptions/images.

## 3. Product Discovery UX
- **Image Priority:** Product images are the primary sales driver. They must take up the majority of the viewport on the Product Details page. 
- **Skeleton Loaders:** Do not show a blank screen or a centered spinner while products load. Show a grid of gray, pulsing skeleton cards (`animate-pulse`) to establish layout expectations.
- **Infinite Scroll vs Pagination:**
  - Mobile: Use Infinite Scroll (load more automatically when reaching the bottom).
  - Desktop: Use Pagination or a explicit "Load More" button to avoid trapping the user from reaching the footer.

## 4. Checkout UX
- **Frictionless Flow:** The checkout process must be isolated. Remove the main site navigation and footer during checkout to prevent distractions and cart abandonment. Show only the Weebster logo (linking to cart/home) and secure checkout trust badges.
- **Linear Progression:** Ask for information linearly. Do not show payment fields until shipping is selected.
- **Auto-formatting:** Credit card/phone number inputs must auto-format with spaces (e.g., `XXXX XXXX XXXX XXXX`) as the user types.

## 5. Interaction & Feedback Rules
- **Micro-interactions:** 
  - Clicking "Add to Wishlist" should trigger a brief scale "pop" animation on the heart icon.
  - Adding to Cart must show a non-intrusive Toast notification or briefly open the Cart Drawer.
- **Destructive Actions:** Deleting an address or an order (Admin) must require a confirmation step (e.g., "Are you sure?"). On mobile, use a bottom sheet; on desktop, an alert dialog.
- **Loading States:** Any button that triggers a network request must switch to a loading state (spinner + disabled) to prevent double-submissions.

## 6. Accessibility (a11y)
- **Contrast Ratio:** All text must meet WCAG AA standards (4.5:1 contrast ratio against its background). No light gray text on white backgrounds.
- **Focus Rings:** Keyboard navigation must be supported. Focus rings (outlines) must *never* be disabled via CSS (`outline: none`) unless replaced by a custom, highly visible focus state (e.g., custom `box-shadow` ring).
- **Screen Readers:** All non-decorative images must have descriptive `alt` text. Icon-only buttons (like a trash can) must have an invisible `.sr-only` label or `aria-label`.

## 7. Consistency Rules
- **Language:** Tone should be premium, concise, and helpful. Use "Add to Cart" consistently, never mixing with "Buy Now" or "Add to Bag" on the same platform.
- **Capitalization:** Use Title Case for Buttons and Navigation (e.g., "Add to Cart", "Order History"). Use Sentence case for body text and descriptions.
- **Iconography:** Use a single, consistent icon set (e.g., Lucide Icons) across the entire platform. Do not mix stroke icons with filled icons unless denoting active/inactive states.
