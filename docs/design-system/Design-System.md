# Design System - Weebster

This document serves as the root entry point for the Weebster Design System. It establishes the high-level architecture and decisions governing how we build user interfaces.

---

## 1. Single Source of Truth
This directory (`docs/design-system/`) is the definitive single source of truth. If a design choice in Figma contradicts this documentation, the documentation wins. If a developer implements a style not defined here, it is considered a bug and must be refactored.

## 2. Technology Choices & Design Decisions

### Decision 1: 100% Custom CSS Modules
- **What:** We use CSS Modules (`*.module.css`) instead of utility-first frameworks like Tailwind CSS or component libraries like Bootstrap/MUI.
- **Why:** Absolute control and true modularity. Utility classes pollute HTML and limit complex selector styling. Component libraries enforce generic aesthetics that are difficult to override for a truly premium, custom brand identity.
- **Benefits:** No unused CSS, zero specificity clashes, and a pristine, semantic DOM.
- **Tradeoffs:** Higher initial development time as developers must write custom CSS for every component.
- **Future Scalability:** CSS Modules easily migrate to newer build tools (Vite, Turbopack) without relying on a framework compiler.

### Decision 2: Global CSS Variables (Custom Properties)
- **What:** All design tokens (colors, spacing, typography) are defined as CSS variables in `globals.css` (e.g., `var(--color-primary)`).
- **Why:** Enables runtime theming (Dark Mode). It enforces consistency since developers are not allowed to hardcode HEX values in CSS Modules.
- **Benefits:** A single file controls the entire look and feel of the application. Changing the primary color across the entire site takes seconds.

### Decision 3: "Mobile App" Paradigm Over "Responsive Web"
- **What:** The UI is designed to function and feel exactly like a native iOS/Android app when viewed on a mobile device.
- **Why:** Over 75% of e-commerce traffic is mobile. Standard responsive web design (stacking columns) is insufficient for premium conversion rates.
- **Benefits:** Higher engagement, lower cart abandonment, and a superior brand perception.

### Decision 4: JavaScript over TypeScript (UI Layer)
- **What:** We rely on modern JavaScript (ES6+), JSDoc, and PropTypes instead of strict TypeScript for UI components.
- **Why:** Aligns with the architectural decision to maintain a lightweight, fast-iteration UI layer without the overhead of complex type compilation steps.
- **Benefits:** Faster local build times and a lower barrier to entry for UI/UX engineers who excel in CSS/JS but may not be TypeScript experts.

## 3. Structure of the Design System
The system is composed of the following layers:
1. **Design Tokens:** The atomic values (Colors, Typography, Spacing).
2. **CSS Architecture:** How files and classes are organized.
3. **Core Components:** Buttons, Inputs, Cards (The building blocks).
4. **E-Commerce Patterns:** Galleries, Checkout flows (Composed of core components).
5. **Guidelines:** Accessibility, Motion, and Error handling.

Read the specific documentation files in this directory to understand the exact implementation details of each layer.
