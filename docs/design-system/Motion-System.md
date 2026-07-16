# Motion System & Animation Guidelines - Weebster

Motion on Weebster is purposeful. It exists to provide feedback, guide the user's eye, and smooth out state changes. We explicitly avoid flashy, bouncy, or continuous looping animations that distract from the products.

---

## 1. Animation Principles
- **Subtle & Premium:** Less is more. A premium brand doesn't need elements flying across the screen to hold attention.
- **Performant:** Only animate `transform` and `opacity`. Never animate `width`, `height`, `margin`, `padding`, or `box-shadow` as they trigger expensive layout recalculations (reflows) causing jank on mobile.
- **Directional Logic:** Elements entering the screen should move forward (scale up) or slide in from the direction they logically live (e.g., a right-side cart drawer slides in from the right).

## 2. Animation Tokens (from Design Tokens)
Used via CSS variables in `globals.css`:

### Durations
- `--duration-fast`: `150ms` (Hover states, clicks).
- `--duration-normal`: `250ms` (Dropdowns, accordions, simple state changes).
- `--duration-slow`: `400ms` (Page transitions, large modals, drawers entering).

### Easing Curves (Cubic Bezier)
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` - Decelerates. Used when objects enter the screen (they stop smoothly).
- `--ease-in`: `cubic-bezier(0.4, 0, 1, 1)` - Accelerates. Used when objects leave the screen (they speed away).
- `--ease-in-out`: `cubic-bezier(0.4, 0, 0.2, 1)` - Symmetric. Used for elements moving from point A to point B on screen.

## 3. Standard UI Animations

### A. Hover & Interaction States
- **Button Hover:** Background color darkens. Opacity shifts to `--opacity-hover`. (Duration: Fast, Ease: Linear).
- **Card Hover (Desktop only):** Uses `transform: translateY(-4px)` to lift the card slightly towards the user. (Duration: Normal, Ease: Ease-Out).
- **Click (Active State):** Uses `transform: scale(0.97)` to mimic physical depression of a button.

### B. Structural Motion
- **Modals & Drawers:** 
  - Backdrop: Fades in `opacity: 0 -> 1` (Duration: Normal).
  - Drawer (Mobile): Translates `transform: translateY(100%) -> translateY(0)`.
  - Drawer (Desktop): Translates `transform: translateX(100%) -> translateX(0)`.
- **Accordions/Dropdowns:** 
  - To prevent animating height (which causes reflow), we utilize `grid-template-rows: 0fr -> 1fr` transition trick combined with `overflow: hidden`, or animate the `opacity` and `transform: translateY(-10px)` of the dropdown content.

### C. Feedback & Toast Notifications
- **Toast Entrance:** Slides in from the bottom `transform: translateY(20px)` and fades in `opacity: 0 -> 1`.
- **Toast Exit:** Fades out and slides slightly down.

### D. Loading Animations
- **Skeleton Shimmer:** A CSS linear-gradient background that translates horizontally. Must be infinitely looping, but slow enough not to cause motion sickness.
- **Spinner:** Simple SVG rotation (`transform: rotate(360deg)`).

## 4. Accessibility & Reduced Motion
Always respect the user's OS preference for reduced motion. Every animation defined in CSS must be wrapped in or overridden by a `prefers-reduced-motion` media query.

```css
/* Example Implementation */
.card {
  transition: transform var(--duration-normal) var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none; /* Disable animation */
  }
}
```

## 5. Page Transitions
Weebster uses Next.js App Router. We avoid heavy route-level animations to maximize perceived performance. Navigation should feel instantaneous. Any necessary loading state between routes should utilize the Next.js `loading.js` convention to show skeletons, not a full-page fade animation.
