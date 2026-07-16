# Components Architecture - Weebster

This document details the core, reusable UI components for Weebster. All components are built using React and custom CSS Modules.

---

## 1. Buttons

### Purpose
To trigger an action (Submit, Navigate, Add to Cart).

### Variants
- **Primary:** Solid `--color-primary` background. White text. Used for the main action on a page.
- **Secondary:** Solid `--color-secondary` background. Dark text. Used for alternative actions.
- **Outline:** Transparent background. 1px solid `--color-border` border. Used for cancel/back actions.
- **Ghost:** No background, no border. Used for tertiary actions (e.g., "Clear filters").

### Sizes
- **sm:** Height 32px. `padding: 0 var(--space-3)`. Font: `--text-sm`.
- **md (Default):** Height 40px (Desktop) / 48px (Mobile). `padding: 0 var(--space-4)`. Font: `--text-base`.
- **lg:** Height 56px. `padding: 0 var(--space-6)`. Font: `--text-lg`. Used for Hero CTAs.

### Props
- `variant` (primary | secondary | outline | ghost)
- `size` (sm | md | lg)
- `isLoading` (boolean) - Replaces text with a spinner and disables button.
- `disabled` (boolean)
- `fullWidth` (boolean) - `width: 100%`.
- `leftIcon` / `rightIcon` (ReactNode).

## 2. Badges & Chips

### Purpose
To display status, categories, or tags in a compact form.

### Variants
- **Status (Success/Error/Warning):** Uses semantic background colors. Text is dark.
- **Neutral:** Secondary background color.

### Props
- `variant` (success | error | warning | neutral)
- `text` (string)

## 3. Tooltips

### Purpose
To provide additional context on hover (desktop) or long-press (mobile).

### Behaviour
- Triggered on `mouseenter` / `focus`.
- Displays absolute positioned above/below the trigger.
- Uses `z-index: var(--z-dropdown)`.
- **Accessibility:** Must have `role="tooltip"` and be linked to the trigger via `aria-describedby`.

## 4. Modals & Drawers

### Purpose
To interrupt the flow for critical actions (Modals) or provide contextual tools without leaving the page (Drawers).

### Behaviour (Responsive)
- **Modals:** Center-screen. Used strictly on Desktop.
- **Drawers:** Bottom-sheet slide-up. Used strictly on Mobile for things that would be Modals/Sidebars on Desktop (Filters, Cart).
- **Backdrop:** `--color-overlay`. Clicking backdrop closes the component.
- **Accessibility:** Must trap focus. Must close on `Escape` key. `aria-modal="true"`.

### Props
- `isOpen` (boolean)
- `onClose` (function)
- `title` (string)
- `children` (ReactNode)

## 5. Accordion

### Purpose
To collapse/expand long content (e.g., Product Details, FAQs).

### Behaviour
- Clicking the header toggles the content body.
- Only one panel opens at a time (standard) or multiple (configurable).
- Icon (Chevron) rotates 180deg when open.

### Props
- `items` (Array of `{ title, content }`)
- `allowMultiple` (boolean)

## 6. Breadcrumbs

### Purpose
To show the user's current location in the site hierarchy.

### Behaviour
- Links are separated by a small chevron or slash icon.
- Current page is plain text (not a link) and uses `--color-text-main`. Previous pages are links and use `--color-text-muted`.

## 7. Product Card

### Purpose
The most critical component for e-commerce catalog display.

### Layout
1. **Image Area:** 1:1 Aspect ratio. Contains Wishlist icon button (top right).
2. **Body:** 
   - Product Title (1 line, truncate with ellipsis).
   - Price Block (Current price, optional strikethrough price).
   - Rating Stars (Optional).
3. **Action:** "Add to Cart" button (often appears on hover on Desktop, or sits below price on mobile).

### Hover State (Desktop)
- Image slightly scales up (`transform: scale(1.05)`).
- Card slightly lifts (`transform: translateY(-4px)`).

## 8. Quantity Selector

### Purpose
To adjust item count in the Cart.

### Layout
- Flex container. `[-]` button, `[Input]` field, `[+]` button.
- Width is fixed to prevent layout shift as numbers grow.
- Disabled state for `[-]` when quantity is 1.

## 9. Image Gallery

### Purpose
To view product imagery on the Product Details page.

### Behaviour
- **Desktop:** Main large image on the left. Vertical or horizontal strip of thumbnails. Hovering the main image reveals a magnified view (Zoom).
- **Mobile:** Horizontal swipeable carousel (Snap scrolling). Thumbnails are hidden in favor of pagination dots.
