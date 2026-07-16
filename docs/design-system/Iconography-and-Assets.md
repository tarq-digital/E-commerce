# Iconography & Asset Guidelines - Weebster

This document defines the rules for all non-text visual elements on the platform: Icons, Product Imagery, Illustrations, and Banners.

---

## 1. Iconography System
Icons are visual shorthand. They must be universally understood, legible at small sizes, and visually consistent.

### Icon Library
- We use **Lucide Icons** (or a custom SVG set matching its style).
- **Style:** Stroke-based, geometric, rounded terminals.
- **Stroke Width:** Strict `2px` stroke for all icons to maintain visual weight parity with `Inter Regular` text. Do not scale stroke width up when the icon size increases.

### Icon Usage Rules
- **Size:** 
  - Inline with text (Buttons, Inputs): `16x16px` or `20x20px`.
  - Primary Navigation (Bottom Nav): `24x24px`.
  - Empty State Illustrations: `48x48px` or `64x64px`.
- **State Changes:** 
  - Default: Outlined (Stroke).
  - Active/Selected: Filled (e.g., when an item is added to a Wishlist, the heart icon changes from a 2px stroke to a solid fill in `--color-accent`).
- **Alignment:** Icons placed next to text must be vertically centered. Use `display: inline-flex; align-items: center; gap: var(--space-2);`.

## 2. Product Imagery
Product photography is the single biggest driver of conversion in e-commerce.

### Image Standards
- **Background:** All primary product gallery images must have a pure white `#ffffff` or transparent background to blend seamlessly with the product card.
- **Aspect Ratio:**
  - Product Cards (Grid): Strictly `1:1` (Square).
  - Hero Banners: `16:9` (Desktop), `4:5` (Mobile).
- **Resolution:** Uploaded images must be high resolution (min 1080x1080px) to allow for hover-to-zoom functionality on the Product Details page.

### Technical Implementation
- All images must be served via **Cloudinary**.
- Must use the Next.js `<Image>` component for automatic WebP conversion, resizing, and lazy loading.
- Provide strict `width` and `height` properties (or `fill` with `sizes`) to prevent Cumulative Layout Shift (CLS).

## 3. Illustrations & Banners
- **No Generic Vector Art:** Avoid generic flat-vector "corporate memphis" illustrations (people with disproportionate limbs). They cheapen the premium brand feel.
- **Empty States:** Use high-quality, desaturated 3D renders of toys or sleek, oversized monochromatic line icons for empty states (Cart, Wishlist, 404).
- **Banners:** Text on banners must always remain legible. If placing text over a busy photograph, apply a subtle CSS gradient overlay (`linear-gradient(to right, rgba(15,23,42,0.8), transparent)`) to the image to ensure WCAG text contrast ratios are met.

## 4. UI Copy & Language Guidelines
Visuals and text must work together. UI copy is a design element.
- **Concise:** Use "Cart" not "Shopping Cart".
- **Action-Oriented:** Buttons must start with a verb ("Add to Cart", "View Order", "Apply Filter").
- **Sentence Case:** Use Sentence case for all headers and body text ("Payment details"). Use Title Case for Buttons ("Pay Now"). All-caps should only be used for small `eyebrow` text above headers with increased letter-spacing.
