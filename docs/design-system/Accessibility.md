# Accessibility (a11y) - Weebster

Accessibility is not an afterthought; it is a foundational requirement. Weebster must be usable by everyone, including users relying on screen readers, keyboard navigation, or those with visual impairments. We target **WCAG 2.1 AA** compliance.

---

## 1. Keyboard Navigation
Users must be able to complete a purchase without ever touching a mouse.

### Focus Management
- **Focus Rings:** Never remove the default browser focus ring (`outline: none;`) unless you are replacing it with a custom, highly visible focus state (e.g., `box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-primary);`).
- **Focus Order:** The `tabindex` must follow the logical visual order of the page (top to bottom, left to right). Do not use `tabindex` > 0. Use `tabindex="-1"` only to remove elements from the focus order.
- **Focus Trapping:** When a Modal, Drawer, or dropdown opens, keyboard focus MUST be trapped inside it. Tabbing past the last interactive element inside the modal must loop back to the first. Closing the modal must return focus to the element that triggered it.

## 2. Screen Readers & ARIA

### Semantic HTML
- Use native HTML elements before reaching for ARIA. A `<button>` is always better than `<div role="button">`.
- Use correct heading hierarchy (`h1`, `h2`, `h3`). Do not skip heading levels for styling purposes. Use CSS to change the visual size of a heading if necessary.

### ARIA Attributes
- **`aria-label` / `aria-labelledby`:** Mandatory for any interactive element that lacks visible text (e.g., a "X" close button, or a Cart icon).
- **`aria-expanded`:** Must be toggled on buttons that open accordions, dropdowns, or mobile menus.
- **`aria-hidden="true"`:** Apply to decorative icons to hide them from screen readers to prevent redundant announcements (e.g., a button with an icon and the text "Search" should hide the icon).
- **`aria-live`:** Use `aria-live="polite"` on the Cart subtotal and Toast notifications to announce dynamic changes to the user without interrupting them.

## 3. Visual Accessibility

### Color Contrast
- **Text:** Must have a contrast ratio of at least `4.5:1` against its background (WCAG AA). Large text (24px+) can be `3:1`.
- **UI Components:** Interactive elements (Input borders, buttons) must have a contrast ratio of `3:1` against their background.
- **Color as Information:** Never use color alone to convey meaning. An error input cannot just turn red; it must also display a text error message or an error icon.

### Touch Targets
- All clickable elements (links, buttons, pagination dots) must have a minimum physical size of **44x44 CSS pixels** on mobile devices to prevent accidental misclicks.

### Reduced Motion
- As defined in the `Motion-System.md`, all CSS animations must respect `@media (prefers-reduced-motion: reduce)` by disabling transitions.
