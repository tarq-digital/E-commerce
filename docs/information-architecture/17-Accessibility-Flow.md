# Accessibility Flow & Logic - Weebster

Accessibility (a11y) is integrated into the Information Architecture. This document dictates how users relying on assistive technologies experience the site flow.

---

## 1. Keyboard Navigation Logic
The Tab order must strictly follow the visual DOM order (Top -> Bottom, Left -> Right).

### Skip Links
- A visually hidden link MUST be the very first focusable element on every page: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`.
- **Why:** Allows keyboard users to bypass the massive Mega Menu and jump straight to the product grid.

### Focus Trapping
When any overlay opens (Modal, Drawer, Mobile Hamburger Menu):
1. The element that triggered the overlay must have its identity saved in state.
2. Focus is moved to the first interactive element INSIDE the overlay.
3. Pressing `Tab` cycles through the overlay elements. It CANNOT escape to the background page.
4. Pressing `Escape` closes the overlay.
5. Focus is immediately returned to the trigger element that was saved in step 1.

## 2. Screen Reader Experience (ARIA)

### Dynamic Content Announcements
E-commerce relies heavily on dynamic, non-navigational updates.
- **Adding to Cart:** When a user clicks "Add to Cart", a visually hidden `div` with `aria-live="polite"` must update its text content to *"Spider-Man Action Figure added to your cart."* This informs the screen reader user of the success without forcing them to navigate away.
- **Form Errors:** Error messages must be linked to the input via `aria-describedby` so they are read aloud immediately when the user focuses the invalid field.

### Disclosing Information
- **Accordions & Dropdowns:** The trigger button must have `aria-expanded="false"`. When clicked, it updates to `aria-expanded="true"`. The content panel must have an `id` that matches the trigger's `aria-controls` attribute.

## 3. Cognitive & Visual Accessibility
- **Error Recovery:** The IA never leaves a user stuck. If a checkout fails, the exact reason (e.g., "Card expired") is placed prominently at the top of the form, and focus is forced to that error message.
- **Color Independence:** We never use color alone to convey meaning. 
  - *Bad:* Out-of-stock items just turn gray.
  - *Good:* Out-of-stock items turn gray AND have a bold "Out of Stock" text badge.
- **Touch Targets:** The IA dictates that no two clickable links can be placed closer than 8px on mobile to prevent accidental taps. All buttons must be at least 44px tall.
