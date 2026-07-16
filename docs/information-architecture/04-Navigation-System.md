# Navigation System - Weebster

This document dictates how users traverse the Weebster platform across different devices. The navigation must remain consistent, predictable, and optimized for touch on mobile devices.

---

## 1. Desktop Navigation (≥1024px)

### Top Header Bar (Sticky)
- **Left:** Brand Logo (links to `/`).
- **Center:** Mega Menu Triggers (e.g., "Shop Categories", "New Arrivals", "Brands").
- **Right:** 
  - Global Search Bar (Expandable on click).
  - Profile Icon (Hover for dropdown: Login or Dashboard links).
  - Wishlist Icon (Shows badge count).
  - Cart Icon (Shows badge count, clicks to open Drawer).

### Mega Menu
- **Trigger:** Hover intent (200ms delay to prevent accidental flashes).
- **Structure:** 
  - Column 1: Parent Category Links.
  - Column 2: Featured Sub-categories.
  - Column 3: Promotional Banner Image.
- **Rules:** Must be fully keyboard navigable (Tab to open, Arrow keys to navigate).

## 2. Mobile Navigation (<768px)

### Bottom Navigation Bar (Fixed)
The core tenet of our mobile-first design. Placed at `bottom: 0` and fixed above all content except Drawers and Modals.
- **Item 1:** Home (Icon)
- **Item 2:** Search (Icon) - Opens full-screen search modal.
- **Item 3:** Categories (Icon) - Opens Hamburger Drawer.
- **Item 4:** Cart (Icon with badge).
- **Item 5:** Profile (Icon).

### Mobile Top Header (Scroll Hides)
- **Content:** Minimal. Just the Brand Logo (Center) and maybe a "Menu" hamburger fallback (Left) if Bottom Nav is disabled on specific pages (like Checkout).

## 3. Contextual Navigation

### Breadcrumbs
- **Usage:** Mandatory on all Product Details and Category pages.
- **Format:** `Home > Action Figures > Marvel > Spider-Man Variant`
- **Rule:** The last item is the current page and is NOT a link. It is styled in `--color-text-main`. Previous items are links styled in `--color-text-muted`.

### Sidebar Navigation (Admin & User Dashboard)
- **Usage:** Used exclusively in the `/dashboard` and `/admin` Route Groups.
- **Desktop:** Fixed left sidebar.
- **Mobile:** Converts to a horizontal scrollable tab bar just below the header, OR a specific dropdown selector, preventing the need for a complex double-hamburger menu.

## 4. Search Navigation
Search is not just an input; it is a primary navigation modality.
- **Desktop:** Clicking the search bar opens a dropdown showing "Trending Searches" before the user even types.
- **Mobile:** Tapping the Search icon in the Bottom Nav opens a full-screen search overlay, immediately focusing the keyboard.

## 5. Footer Navigation
Used for low-priority links and SEO footprint.
- **Columns:** 
  - **Shop:** All Products, New Arrivals, Best Sellers.
  - **Support:** Contact Us, FAQ, Shipping & Returns.
  - **Legal:** Terms of Service, Privacy Policy.
- **Mobile Rule:** Columns collapse into Accordions on mobile to prevent the footer from becoming endlessly long.
