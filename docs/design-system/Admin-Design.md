# Admin Dashboard Design System - Weebster

The Admin Dashboard is a separate application context. While it shares the core design tokens (Colors, Spacing, Typography) with the storefront, its layout and UX patterns are strictly optimized for data density, speed, and utility rather than marketing.

---

## 1. Dashboard Layout

### Layout Philosophy
Data density is prioritized. Whitespace is slightly reduced compared to the storefront to fit more information on screen.

### Sidebar (Navigation)
- **Desktop:** Fixed to the left (`width: 250px`). Dark theme by default (using `--color-primary` background) to clearly separate the admin context from the customer storefront.
- **Mobile:** Hidden behind a Hamburger menu. Opens as a Drawer.
- **Content:** Links to Dashboard, Products, Orders, Categories, Users, Settings. Active links are highlighted with a brighter background and left-border accent.

### Top Header
- **Content:** Page Title, Global Search bar, Admin Profile Dropdown.
- **Visuals:** White background, subtle bottom border (`--border-1`).

### Main Content Area
- Uses `--color-secondary` (soft gray) as the background so white data cards and tables "pop" off the screen.

## 2. Admin UI Components

### Data Tables
- **Purpose:** The core component of the Admin panel (Orders, Products lists).
- **Design:** 
  - White background. 
  - `Inter` font for extreme readability.
  - Alternating row colors (`--color-surface-alt`) for long lists.
  - Sticky header row when scrolling.
- **Interactions:** Rows highlight on hover. Clicking anywhere on the row should route to the detail page.

### Stat Cards
- **Purpose:** High-level metrics on the dashboard (e.g., "Total Revenue").
- **Design:** Clean white card, subtle shadow. Large numeric value in `Outfit` font, accompanied by a smaller trend indicator (e.g., "+5% this week" in green).

### Admin Forms (Data Entry)
- Unlike checkout forms, admin forms (e.g., "Create Product") can be massive.
- **Layout:** Split into logical sections (Basic Info, Pricing, Images). Use Card wrappers to visually group these sections.
- **Sticky Actions:** The "Save Product" button must be sticky at the top right or bottom of the screen, so the admin doesn't have to scroll all the way down to save after making a quick change at the top.

## 3. Feedback & Notifications
Admins make destructive changes (deleting products, cancelling orders). Feedback must be aggressive.
- **Destructive Actions:** Must use the `--color-error` (Red) for the button.
- **Confirmation Dialogs:** Standard browser `alert()` is banned. Must use a custom Modal dialog requiring explicit confirmation before a destructive action proceeds.
- **Toasts:** Every successful save, update, or delete must trigger a Toast notification confirming the action.
