# Design Tokens - Weebster

Design tokens are the atomic, indivisible pieces of our visual design system. They are stored centrally in `globals.css` as CSS Custom Properties. Hardcoding values in CSS Modules is strictly prohibited.

---

## 1. Global CSS Implementation Structure
Tokens are defined in `apps/frontend/src/styles/globals.css` under the `:root` pseudo-class.

```css
:root {
  /* Color Tokens */
  --color-primary: #0f172a;
  
  /* Spacing Tokens */
  --space-4: 0.25rem;
  
  /* ...etc */
}
```

## 2. Token Categories

### A. Radius (Border Radius)
We use a slightly rounded, modern aesthetic to feel friendly but premium. Avoid fully rounded pill-shapes except for specific badges.
- `--radius-sm`: `0.25rem` (4px) - Used for checkboxes, small inputs.
- `--radius-md`: `0.5rem` (8px) - Default for buttons, inputs, dropdowns.
- `--radius-lg`: `0.75rem` (12px) - Used for product cards, small modals.
- `--radius-xl`: `1rem` (16px) - Used for large modals, bottom sheet drawers.
- `--radius-full`: `9999px` - Used for avatars, circular icon buttons.

### B. Border Width
- `--border-1`: `1px` - Default for inputs, dividers, subtle card outlines.
- `--border-2`: `2px` - Used for focus states, selected states (e.g., choosing a size variant).

### C. Opacity
Used primarily for overlays, disabled states, and hover effects on solid colors.
- `--opacity-hover`: `0.85` - Slight transparency on button hover.
- `--opacity-disabled`: `0.5` - For disabled buttons and inputs.
- `--opacity-overlay`: `0.4` - For the dark background behind modals/drawers.

### D. Elevation (Z-Index)
Strict z-index management prevents overlapping nightmares.
- `--z-hide`: `-1`
- `--z-base`: `0`
- `--z-dropdown`: `100` (Dropdown menus, tooltips)
- `--z-sticky`: `200` (Sticky headers, bottom navigation)
- `--z-overlay`: `300` (Modal backdrop)
- `--z-modal`: `400` (Modals, drawers)
- `--z-toast`: `500` (Notifications, error toasts)

### E. Shadows
We avoid heavy, dark drop-shadows. Shadows are soft, diffused, and slightly blue-tinted to match the primary brand color.
- `--shadow-sm`: `0 1px 2px 0 rgba(15, 23, 42, 0.05)` - Subtle lift for headers.
- `--shadow-md`: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)` - Default for cards on hover.
- `--shadow-lg`: `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)` - Dropdowns, floating action buttons.
- `--shadow-modal`: `0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 10px 10px -5px rgba(15, 23, 42, 0.04)` - Modals, drawers.

### F. Container Widths
Defines the maximum width of content areas to ensure readability on ultra-wide monitors.
- `--container-sm`: `640px` - Used for isolated forms (Login/Checkout).
- `--container-md`: `768px` - Used for text-heavy pages (Terms, Privacy).
- `--container-lg`: `1024px` - Standard content wrapper.
- `--container-xl`: `1280px` - Max width for the main e-commerce product grid.

### G. Timing & Duration (Animation)
- `--duration-fast`: `150ms` - Micro-interactions (hover, focus, button clicks).
- `--duration-normal`: `250ms` - State changes (dropdown opens, accordion expands).
- `--duration-slow`: `400ms` - Large structural changes (page transitions, modal slide-ins).

- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` - Use when elements enter the screen.
- `--ease-in`: `cubic-bezier(0.4, 0, 1, 1)` - Use when elements leave the screen.
- `--ease-in-out`: `cubic-bezier(0.4, 0, 0.2, 1)` - General transitions.
