# Color System - Weebster

This document details the exact color palette for Weebster. All colors must be consumed via CSS Variables defined in `globals.css`. Hardcoded HEX values in components are strictly prohibited.

---

## 1. Color Palette Philosophy
Our palette is restrained. We rely on whitespace and typography for layout, using color deliberately to draw focus, indicate interactivity, or signal state.

All primary layout colors are defined in HSL format to allow easy manipulation via `calc()` if dynamic theming is ever required, but for documentation, HEX/RGB equivalents are provided.

## 2. Brand Colors

### Primary (Navy)
Used for the most critical actions: Add to Cart, Proceed to Checkout, primary navigation links.
- **`--color-primary`**: `#0f172a` (HSL: 222.2, 47.4%, 11.2%)
- **`--color-primary-hover`**: `#1e293b` (Lighter tint for button hovers)
- **`--color-primary-foreground`**: `#ffffff` (Text on primary backgrounds)

### Secondary (Slate Gray)
Used for secondary actions, borders, card backgrounds, and muted text.
- **`--color-secondary`**: `#f1f5f9` (HSL: 210, 40%, 96.1%)
- **`--color-secondary-hover`**: `#e2e8f0` 
- **`--color-secondary-foreground`**: `#0f172a` (Text on secondary backgrounds)

### Accent (Coral Red)
Used *sparingly* for sale tags, wishlist active states, and high-urgency notifications.
- **`--color-accent`**: `#ef4444` (HSL: 0, 84.2%, 60.2%)
- **`--color-accent-hover`**: `#dc2626`
- **`--color-accent-foreground`**: `#ffffff`

## 3. Semantic Colors (Feedback & States)

### Success
- **`--color-success`**: `#22c55e` - Used for "Order Confirmed", "In Stock".
- **`--color-success-bg`**: `#dcfce7` - Soft background for success toasts.

### Error
- **`--color-error`**: `#ef4444` (Shares Accent token) - Used for validation errors, failed payments.
- **`--color-error-bg`**: `#fee2e2` - Soft background for error alerts.

### Warning
- **`--color-warning`**: `#f59e0b` - Used for "Low Stock" (e.g., Only 2 left!).
- **`--color-warning-bg`**: `#fef3c7`

### Info
- **`--color-info`**: `#3b82f6` - Used for informational toasts or links.
- **`--color-info-bg`**: `#dbeafe`

## 4. UI Layout Colors

### Backgrounds
- **`--color-background`**: `#ffffff` - Main page background.
- **`--color-surface`**: `#ffffff` - Card and modal backgrounds (differentiated by shadow, not color).
- **`--color-surface-alt`**: `#f8fafc` - For alternating table rows or slight visual separation sections.

### Text
- **`--color-text-main`**: `#0f172a` (Matches Primary) - Main body copy and headings.
- **`--color-text-muted`**: `#64748b` - Helper text, timestamps, breadcrumbs.
- **`--color-text-disabled`**: `#94a3b8` - Disabled input text.

### Borders
- **`--color-border`**: `#e2e8f0` - Default 1px borders (inputs, cards).
- **`--color-border-hover`**: `#cbd5e1` - Input hover state before focus.
- **`--color-border-focus`**: `#0f172a` (Matches Primary) - Active focus ring color.

### Interactive States
- **`--color-overlay`**: `rgba(15, 23, 42, 0.4)` - Modal backdrops.
- **`--color-skeleton`**: `#e2e8f0` - Base color for loading shimmers.
- **`--color-skeleton-highlight`**: `#f1f5f9` - Highlight color for loading shimmers.

## 5. Accessibility (WCAG Compliance)
- **Primary vs Primary Foreground:** Contrast ratio of 16:1 (Passes AAA).
- **Text Muted vs Background:** `#64748b` on `#ffffff` has a contrast ratio of 4.6:1 (Passes AA for standard text).
- **Rule:** Never place `--color-text-muted` on `--color-secondary` background, as it will fail contrast checks. Use `--color-text-main` instead.
