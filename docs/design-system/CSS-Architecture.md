# CSS Architecture - Weebster

This document outlines how we write, structure, and scale CSS across the Weebster platform using Custom CSS Modules and Global CSS variables. We explicitly avoid utility classes (Tailwind) to maintain total control over our DOM and exact design specifications.

---

## 1. Core Structure
All styling lives within the `apps/frontend/src/styles/` directory or alongside components.

```text
src/
├── styles/
│   ├── globals.css         # CSS Variables, Resets, and Global Font declarations
│   ├── normalize.css       # Cross-browser consistency reset (imported in globals)
│   ├── animations.css      # Reusable @keyframes
│   └── typography.css      # Base heading/body definitions
├── components/
│   └── ui/
│       ├── Button/
│       │   ├── Button.js
│       │   └── Button.module.css  # Component-scoped CSS
```

## 2. `globals.css` (The Foundation)
This file is the engine of the design system. It contains:
1. `@import` of resets and base styles.
2. `:root` variables for all Design Tokens (Colors, Spacing, Z-index).
3. Base element styling (`html`, `body`, `a`). No class names should be styled here.

## 3. CSS Modules (The Building Blocks)
Every React component has an accompanying `.module.css` file.

### Naming Conventions
- We use a modified BEM (Block Element Modifier) naming convention within our CSS modules for clarity, though CSS Modules handle the actual scoping.
- Classes should describe *what* the element is, not *how* it looks.
  - **Good:** `.submitButton`, `.cardHeader`, `.errorText`
  - **Bad:** `.blueBtn`, `.largeMarginTop`

### Rule of Composition
Components should define their own internal layout (padding, internal gaps, borders), but they should **never define their own outer margin**. 
- A `Button` should not have `margin-top`.
- The parent container (e.g., `Form`) should dictate the layout and spacing of its children using `display: flex` and `gap`. This makes the `Button` 100% reusable anywhere.

## 4. Writing Maintainable CSS

### Variables First
Never hardcode colors or spacing.
```css
/* WRONG */
.card {
  padding: 16px;
  background-color: #f1f5f9;
}

/* CORRECT */
.card {
  padding: var(--space-4);
  background-color: var(--color-secondary);
}
```

### Z-Index Management
Never use arbitrary z-index numbers (`z-index: 9999`). Use the predefined tokens.
```css
.modal {
  z-index: var(--z-modal);
}
```

### Media Queries & Responsive Design
Media queries should be written directly inside the selector they modify to keep logic co-located.
```css
.productGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Mobile default */
  gap: var(--space-4);
}

@media (min-width: 1024px) {
  .productGrid {
    grid-template-columns: repeat(4, 1fr); /* Desktop override */
    gap: var(--space-6);
  }
}
```

## 5. Performance Guidelines
- **Avoid deep nesting:** CSS modules make deep nesting unnecessary. Avoid `.card .header .title`. Just use `.title`. Deep nesting slows down browser style recalculation.
- **Avoid universal selectors:** Do not use `*` inside CSS modules.
- **Animate cheaply:** As noted in `Motion-System.md`, only animate `transform` and `opacity`. If you must animate a height change, investigate alternative UX patterns or accept the performance hit gracefully.
