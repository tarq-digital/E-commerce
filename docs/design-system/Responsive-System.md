# Responsive System & Breakpoints - Weebster

Weebster is built strictly **Mobile-First**. CSS rules represent the mobile experience by default, and `min-width` media queries are used to progressively enhance the layout for larger screens.

---

## 1. Breakpoint Tokens
Defined in the CSS architecture as standard Media Query ranges.

- **Mobile:** Default (No media query required. 0 - 767px)
- **Tablet (`md`):** `@media (min-width: 768px)`
- **Desktop (`lg`):** `@media (min-width: 1024px)`
- **Large Desktop (`xl`):** `@media (min-width: 1280px)`

## 2. Layout Adaptation Rules

### A. Navigation
- **Mobile (<768px):** Uses a fixed **Bottom Navigation Bar** for core routes (Home, Shop, Cart, Profile) and a Hamburger Menu (Drawer) for category drill-down. The top header is minimal (Logo + Search Icon).
- **Desktop (≥1024px):** Bottom Navigation is hidden. Top header expands to include full navigation links, Mega Menus for categories, a wide search bar, and cart icons.

### B. Product Grids
- **Mobile:** 2 columns (`grid-template-columns: 1fr 1fr`).
- **Tablet:** 3 columns.
- **Desktop:** 4 columns.

### C. Modals vs Drawers
- **Mobile:** Modals centered on the screen are banned (they are difficult to close one-handed). All dialogs (Filters, Cart, Quick Add) must open as a **Bottom Sheet Drawer** spanning 100% width and swiping down to close.
- **Desktop:** Drawers are converted to right-aligned sidebars (e.g., Cart) or center-screen Modals (e.g., Newsletter signup).

## 3. Touch-Friendly Rules (Mobile Specific)
- **Minimum Target Size:** All buttons, links, and icons must have a minimum touch area of 44x44px (Apple HIG standard). 
- **Sticky CTAs:** On long scrolling pages (Product Details, Checkout), the primary action button ("Add to Cart", "Pay Now") must detach from the document flow and become `position: sticky; bottom: 0;` (or sit just above the Bottom Nav) so it is always within thumb reach.
- **Hover States:** Hover states (`:hover`) must be wrapped in `@media (hover: hover) { ... }` in CSS Modules to prevent "sticky hover" bugs on iOS Safari where a tapped element remains in its hover state.

## 4. Performance Considerations for Responsive UI
- **DOM Structure:** Do not render two completely different components for mobile and desktop (e.g., `<MobileMenu />` and `<DesktopMenu />` both in the DOM) if they contain heavy imagery or logic. Use CSS to hide/show visually, but rely on React window-size hooks to conditionally prevent rendering heavy JS components if they aren't needed on that viewport.
