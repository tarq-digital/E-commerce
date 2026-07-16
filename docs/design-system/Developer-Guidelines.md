# Developer Guidelines - Weebster Design System

This document bridges the gap between the design system and the engineering implementation. It dictates how frontend engineers must translate these guidelines into code.

---

## 1. Styling Restrictions

### No Hardcoded Values
- **Colors:** You may never type a HEX code (`#ff0000`) or RGB value in a CSS module. You must use `var(--color-...)`.
- **Spacing:** You may never type a pixel value for margin/padding (e.g., `margin-top: 15px`). You must use `var(--space-...)`.
- **Enforcement:** These rules will be strictly enforced during PR code reviews.

### CSS Module Usage
- Import your styles as `classes` or `styles`.
- Example:
  ```javascript
  import styles from './Button.module.css';
  
  export function Button({ children }) {
    return <button className={styles.button}>{children}</button>;
  }
  ```
- Do not use inline styles (`style={{ color: 'red' }}`) unless dealing with highly dynamic, JS-calculated values (e.g., `transform: translateX(${offset}px)` for a carousel).

## 2. Component Composition Rules

### The "Dumb Component" Rule
UI components (Button, Input, Card) must be "dumb". They should not contain business logic, context consumers, or API calls.
- **Good:** `<ProductCard title={product.title} price={product.price} />`
- **Bad:** `<ProductCard productId="123" />` (Where the card fetches its own data).

### Layout Delegation
Components should not dictate their own outer spacing.
- Never write `.button { margin-top: 16px; }`.
- The parent container should handle layout using CSS Grid or Flexbox `gap`.

## 3. DOM & React Best Practices

### Semantic HTML
- Do not use `<div>` for everything.
- Use `<section>` for page sections, `<article>` for product cards, `<nav>` for navigation, and `<button>` for clickable actions.

### ClassName Concatenation
When combining CSS Module classes with conditional states, use template literals or a lightweight utility (like `clsx` if approved, otherwise native JS).
```javascript
// Native JS approach
const buttonClass = `${styles.button} ${disabled ? styles.disabled : ''} ${styles[variant]}`;
```

## 4. Quality Assurance (QA) Checklist for UI Devs
Before opening a PR, the developer must verify the following:
- [ ] Have I checked this component at 320px (Small Mobile), 768px (Tablet), and 1280px (Desktop)?
- [ ] Did I use CSS variables for all colors and spacing?
- [ ] Can I navigate to and trigger this component using only my keyboard (Tab/Enter)?
- [ ] Is there a visible hover state?
- [ ] Is there a visible active (pressed) state?
- [ ] Are error states clearly defined and colored appropriately?
