# Typography System - Weebster

Typography is the most critical element of our clean, minimal interface. Our typographic scale ensures hierarchy, readability, and a premium feel across all devices.

---

## 1. Font Families
We use Google Fonts optimized via Next.js `next/font/google`.

### A. Display / Heading Font: Outfit
- **Usage:** Hero banners, H1-H3, Product Titles.
- **Why:** Slightly geometric, modern, and premium. Distinctive enough to give character but clean enough for retail.
- **Weights:** SemiBold (600), Bold (700).

### B. Body / UI Font: Inter
- **Usage:** Paragraphs, form labels, buttons, tables, pricing.
- **Why:** The industry standard for legible, data-dense UI. Highly readable at small sizes.
- **Weights:** Regular (400), Medium (500).

## 2. Responsive Font Scale (CSS Variables)
Instead of relying on fixed pixel sizes (which fail on zooming), we use `rem` based on a 16px root. The scale shifts automatically via media queries in `globals.css`.

### Headings (Outfit)
- **`--text-h1`**: 
  - Mobile: `2rem` (32px), Line Height `1.2`
  - Desktop: `3rem` (48px), Line Height `1.1`
- **`--text-h2`**: 
  - Mobile: `1.5rem` (24px), Line Height `1.3`
  - Desktop: `2.25rem` (36px), Line Height `1.2`
- **`--text-h3`**: 
  - Mobile: `1.25rem` (20px), Line Height `1.4`
  - Desktop: `1.5rem` (24px), Line Height `1.3`

### Body (Inter)
- **`--text-lg` (Intro Text):** `1.125rem` (18px), Line Height `1.6`
- **`--text-base` (Standard Body):** `1rem` (16px), Line Height `1.5`
- **`--text-sm` (UI/Labels):** `0.875rem` (14px), Line Height `1.4`
- **`--text-xs` (Legal/Badges):** `0.75rem` (12px), Line Height `1.3`

## 3. Specific UI Typography Rules

### Product Price
- Must use `Inter Medium (500)`.
- Base price uses `--text-lg` or `--text-xl` (if on detail page).
- Strikethrough/compare price uses `--text-sm` with `--color-text-muted`.

### Buttons
- Must use `Inter Medium (500)`.
- Desktop height (40px) uses `--text-sm`.
- Mobile height (48px touch target) uses `--text-base`.
- Never use uppercase text in buttons (reduces readability). Use Title Case ("Add to Cart").

### Labels & Forms
- Input labels use `--text-sm`, `Inter Medium`, `--color-text-main`.
- Error messages use `--text-xs`, `Inter Regular`, `--color-error`.

## 4. Letter Spacing (Tracking)
- **Headings:** `-0.02em` (Tighter tracking for large text looks more cohesive).
- **Body:** `0` (Default).
- **Eyebrow Text (Small All-Caps Categories):** `0.05em` (Looser tracking for small caps improves readability).

## 5. Accessibility Guidelines
- **Minimum Size:** No text should ever be smaller than `12px` (`0.75rem`).
- **Line Length (Measure):** Paragraph text should not exceed 75 characters per line to maintain eye tracking. Use `--container-md` to restrict width on text-heavy pages.
- **Dynamic Type:** By using `rem`, our typography respects the user's OS-level font size preferences. Do not override root `html { font-size }` with pixels.
