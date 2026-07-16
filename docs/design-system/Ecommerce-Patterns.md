# E-Commerce Patterns - Weebster

This document details the complex compositions of UI components that form standard e-commerce flows.

---

## 1. Product Catalog & Filtering

### Desktop Sidebar Filter
- **Layout:** Left column (250px wide).
- **Behaviour:** Accordion-style sections for Category, Price Range, and Availability. Checkboxes inside.
- **Interaction:** Checking a box instantly updates the URL query params and fetches new data (no "Apply" button needed on desktop).

### Mobile Filter Drawer
- **Layout:** A sticky floating button "Filters (2)" at the bottom of the screen. Tapping opens a full-screen Bottom Sheet Drawer.
- **Behaviour:** Filters are stacked vertically.
- **Interaction:** Requires an explicit "Apply Filters" sticky button at the bottom of the drawer to prevent excessive API calls on spotty mobile networks.

## 2. Cart Drawer (Slide-out)

### Layout
- **Header:** "Your Cart (3 items)" + Close (X) button.
- **Body:** Scrollable list of `CartItem` components (Image, Title, Price, QuantitySelector, Remove link).
- **Footer:** Fixed to bottom. Shows Subtotal, Shipping disclaimer, and a massive, full-width `Primary Button` for "Checkout".

### Empty State
- Illustration of an empty box. Text: "Your cart is empty." Button: "Continue Shopping" (closes drawer).

## 3. Single-Page Checkout

### Philosophy
Checkout must be an isolated, distraction-free environment. No main navbar, no footer links.

### Anatomy
- **Left Column (Main Flow):**
  1. Contact Info (Email/Phone).
  2. Shipping Address (Saved addresses as selectable cards, or form for new).
  3. Payment Method (Razorpay trigger).
- **Right Column (Sticky Summary):**
  - Order items recap.
  - Subtotal, Tax, Shipping calculations.
  - Total Price.

### Address Selection Card
- A radio-button styled as a card.
- Displays Name, Street, City, Pincode.
- Selected state uses `--border-2` and `--color-primary` border.

## 4. Order Timeline (Dashboard)

### Layout
- A vertical stepper component tracking order status.
- **States:** Pending -> Processing -> Shipped -> Delivered.
- **Visuals:** Completed steps use a solid `--color-success` circle. Pending steps use a hollow circle. A connecting vertical line ties them together.

## 5. Mega Menu (Desktop Navigation)

### Layout
- Triggers on hover over top-level categories (e.g., "Action Figures").
- Opens a full-width dropdown panel (with a subtle shadow) just below the navbar.
- **Content:** 2-3 columns of sub-category text links. 1 column reserved for a promotional banner/image (e.g., "20% off Marvel Figures").
