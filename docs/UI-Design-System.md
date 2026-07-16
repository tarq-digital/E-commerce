# UI Design System

## 1. Overview
The Weebster Design System ensures a consistent, premium, and minimal aesthetic across the platform. It strictly avoids Tailwind CSS, relying instead on CSS Variables (Custom Properties) globally and CSS Modules for component-scoped scoping. The design focuses on a "Light Theme" that feels bright, trustworthy, and modern, suitable for high-end toys and collectibles.

## 2. Typography
**Primary Font (Headings):** `Outfit` (Sans-serif, Geometric, Modern)
**Secondary Font (Body):** `Inter` (Sans-serif, Highly readable)

### CSS Variables
```css
:root {
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  --text-h1: 3rem; /* 48px */
  --text-h2: 2.25rem; /* 36px */
  --text-h3: 1.5rem; /* 24px */
  --text-body: 1rem; /* 16px */
  --text-small: 0.875rem; /* 14px */
  
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-bold: 700;
}
```

## 3. Color Palette
The color palette is vibrant yet minimal.

```css
:root {
  /* Brand Colors */
  --color-primary: #4F46E5; /* Indigo */
  --color-primary-hover: #4338CA;
  --color-secondary: #F43F5E; /* Rose / Accent */
  
  /* Neutral / Surface Colors (Light Theme) */
  --color-background: #FAFAFA; /* Off-white background */
  --color-surface: #FFFFFF; /* Pure white for cards/modals */
  --color-border: #E5E7EB;
  
  /* Text Colors */
  --color-text-primary: #111827; /* Dark Gray */
  --color-text-secondary: #4B5563; /* Medium Gray */
  --color-text-disabled: #9CA3AF;
  
  /* Status Colors */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
}
```

## 4. Spacing & Grid System
Weebster uses an 8px base spacing system to ensure rhythmic vertical and horizontal flow.

```css
:root {
  --space-1: 0.5rem;  /* 8px */
  --space-2: 1rem;    /* 16px */
  --space-3: 1.5rem;  /* 24px */
  --space-4: 2rem;    /* 32px */
  --space-6: 3rem;    /* 48px */
  --space-8: 4rem;    /* 64px */
}
```

**Grid:** A standard 12-column responsive grid is implemented via CSS Grid.
- **Desktop:** 12 columns, 24px gap.
- **Tablet:** 8 columns, 16px gap.
- **Mobile:** 4 columns, 16px gap.

## 5. Animations & Transitions
Animations are subtle, premium, and performant (using `transform` and `opacity`).

```css
:root {
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```
**Hover Effects:** Product cards translate up by 4px (`transform: translateY(-4px)`) and gain a stronger drop shadow on hover.

## 6. Responsive Breakpoints
Mobile-first CSS media queries:
```css
/* Mobile: Base Styles (No media query needed) */

/* Tablet */
@media (min-width: 768px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Large Desktop */
@media (min-width: 1280px) { ... }
```

## 7. Accessibility (a11y)
- **Contrast Ratios:** All text meets WCAG 2.1 AA requirements (minimum 4.5:1 for normal text).
- **Focus States:** Distinct focus rings on all interactive elements (`outline: 2px solid var(--color-primary)`).
- **Aria Labels:** Semantic HTML5 elements used throughout; aria-labels applied to icon-only buttons.
