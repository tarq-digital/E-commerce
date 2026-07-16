# Design System - Weebster

This document defines the strict visual language and UI components for the Weebster platform. All frontend development must utilize these predefined tokens via Tailwind CSS and Shadcn UI. No custom CSS should be written unless absolutely necessary.

---

## 1. Core Philosophy
- **Premium Aesthetic:** Weebster is not a discount bin. It is a premium destination. The design must reflect this through ample whitespace, crisp typography, and restrained use of color.
- **Mobile First:** The design system assumes a base viewport of 375px (iPhone SE). All components must look perfect on mobile before scaling up.
- **Component Driven:** Every UI element is a reusable component.

## 2. Color System
All colors are defined as HSL variables in `globals.css` to support seamless Dark Mode in the future.

### Brand Colors
- **Primary:** `--primary: 222.2 47.4% 11.2%` (Deep Navy / Almost Black) - Used for primary actions, headers, and emphasis.
- **Primary Foreground:** `--primary-foreground: 210 40% 98%` (Off-white) - Used for text on primary buttons.
- **Secondary:** `--secondary: 210 40% 96.1%` (Soft Gray) - Used for secondary buttons, card backgrounds.
- **Accent:** `--accent: 0 84.2% 60.2%` (Vibrant Red) - Used *sparingly* for sale tags, error states, and notification dots.

### Neutral Colors (Text & Backgrounds)
- **Background:** `--background: 0 0% 100%` (Pure White)
- **Foreground (Text):** `--foreground: 222.2 84% 4.9%` (Rich Black)
- **Muted:** `--muted: 210 40% 96.1%` (Light Gray - for subtle borders)
- **Muted Foreground:** `--muted-foreground: 215.4 16.3% 46.9%` (Medium Gray - for secondary text)

## 3. Typography
- **Primary Font:** `Inter` (Google Fonts) - Clean, highly legible geometric sans-serif. Used for body text, UI elements, and data tables.
- **Heading Font:** `Outfit` (Google Fonts) - Slightly wider, premium feel for H1-H3.
- **Weights:** 
  - Regular (400) - Body copy.
  - Medium (500) - Button labels, small headers.
  - SemiBold (600) - Section titles.
  - Bold (700) - Main page headers.

## 4. Spacing & Grid System
- **Scale:** Tailwind's default spacing scale (base 4px) is strictly enforced (e.g., `p-4` = 16px, `mb-8` = 32px).
- **Grid Container:**
  - Max width: `1280px` (Desktop).
  - Paddings: Mobile `px-4` (16px), Tablet `px-8` (32px), Desktop `px-12` (48px).

## 5. UI Component Library (via shadcn/ui)

### Buttons
- **Primary:** Solid Deep Navy, white text. No border.
- **Secondary:** Light gray background, dark text.
- **Outline:** Transparent background, 1px solid border.
- **Ghost:** No background, no border. Darkens on hover.
- *Rule:* Minimum height `44px` for touch target compliance on mobile.

### Inputs & Forms
- **Style:** 1px solid border (`--border`), slightly rounded (`rounded-md`).
- **Focus State:** 2px ring in Primary color, no outline.
- **Validation:** Red border and text for errors. Error messages must appear directly below the input.

### Cards (Product & Content)
- **Style:** Pure white background, `rounded-xl`.
- **Border:** Subtle 1px border (`--border`) instead of heavy drop shadows, maintaining a modern flat look.
- **Hover:** Slight Y-axis lift (`-translate-y-1`) and soft shadow (`shadow-md`) on desktop only.

### Badges & Tags
- **In Stock:** Green background, dark green text.
- **Out of Stock:** Gray background, dark gray text.
- **Sale/Discount:** Accent Red background, white text.

### Navigation Elements
- **Bottom Navigation (Mobile):** Fixed to bottom, 64px height, frosted glass effect (`backdrop-blur-md`, `bg-white/80`).
- **Sidebar (Admin):** Fixed left, dark mode theme by default to separate admin context from customer context.

### Feedback Elements
- **Toast:** Bottom-right on desktop, top-center on mobile. Closes after 3s.
- **Skeletons:** Used instead of spinners for content loading. Matches the shape of the content being loaded (e.g., a card skeleton).

## 6. Animation Tokens
- **Transition Duration:** `duration-200` (200ms) for micro-interactions (hover, focus).
- **Easing:** `ease-in-out` for general UI, `ease-out` for entering elements (drawers, modals).
- **Drawers/Modals:** Slide in from bottom (mobile) or right (desktop).

## 7. Responsive Breakpoints
- **Mobile:** Default (0px - 767px)
- **Tablet (`md`):** 768px
- **Desktop (`lg`):** 1024px
- **Wide Desktop (`xl`):** 1280px

## 8. Dark Mode Strategy
- **Version 1:** Light mode only for Customer-facing pages to maintain a clean retail look.
- **Admin Dashboard:** Supports Light and Dark modes.
- *Implementation:* All colors must use CSS variables to allow seamless overriding for dark mode when implemented globally in V2.
