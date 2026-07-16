# Spacing & Grid System - Weebster

Consistent spacing and alignment are the invisible scaffolding of a premium design. Weebster uses a strict 4pt / 8pt baseline grid.

---

## 1. The Spacing Scale
All margins, paddings, and gaps must use these CSS variables. Using arbitrary pixel values (e.g., `margin-top: 17px`) is strictly forbidden.

| Token | Rem Value | Pixel Value | Typical Usage |
|-------|-----------|-------------|---------------|
| `--space-1` | 0.25rem | 4px | Checkbox gap, inner button padding |
| `--space-2` | 0.5rem | 8px | Gap between icon and text |
| `--space-3` | 0.75rem | 12px | Input inner padding |
| `--space-4` | 1rem | 16px | Standard card padding, Mobile page margin |
| `--space-6` | 1.5rem | 24px | Gap between form fields |
| `--space-8` | 2rem | 32px | Tablet page margin, Section internal padding |
| `--space-12` | 3rem | 48px | Gap between major sections (Mobile) |
| `--space-16` | 4rem | 64px | Gap between major sections (Desktop) |
| `--space-24` | 6rem | 96px | Hero banner padding (Desktop) |

## 2. Layout Grid System
We utilize CSS Grid (`display: grid`) for structural layouts and Flexbox (`display: flex`) for component-level alignment.

### Desktop Grid (1024px+)
- **Columns:** 12 columns.
- **Column Gap:** `--space-6` (24px).
- **Margins:** `--space-8` (32px) or `auto` (centered).
- **Max Width:** `--container-xl` (1280px).

### Tablet Grid (768px - 1023px)
- **Columns:** 8 columns.
- **Column Gap:** `--space-4` (16px).
- **Margins:** `--space-8` (32px).

### Mobile Grid (< 768px)
- **Columns:** 4 columns.
- **Column Gap:** `--space-4` (16px).
- **Margins:** `--space-4` (16px).
- **Note:** E-commerce product grids on mobile typically bypass the 4-column layout and use a hardcoded 2-column CSS grid (`grid-template-columns: repeat(2, 1fr)`).

## 3. Responsive Layout Rules
- **Fluid to Fixed:** The layout remains fluid (100% width) up to `1280px`. Above that, it becomes fixed and centered via `margin: 0 auto;`.
- **Vertical Rhythm:** Space *between* sections should always be significantly larger than space *within* sections to ensure clear grouping. Use `--space-16` to separate distinct homepage sections (e.g., Hero from Trending Products).

## 4. Component-Level Spacing Rules
- **Cards:** Product cards must use `--space-4` (16px) for inner padding.
- **Forms:** Form rows (Label + Input) use a gap of `--space-2` (8px). Consecutive form groups use a gap of `--space-6` (24px).
- **Touch Targets (Mobile):** Any clickable element must have a minimum physical dimension of 44x44px. Use `padding` to increase touch areas without increasing visual size if necessary.
