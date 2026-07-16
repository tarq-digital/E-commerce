# Component States & UI Copy Guidelines - Weebster

This document details the universal states a component can exist in, and the specific rules for the micro-copy (text) inside those components.

---

## 1. Universal Component States

Every interactive component (Button, Input, Card) must account for the following states:

### A. Default (Resting)
- **Visuals:** The standard appearance as defined in `Components.md`.
- **Purpose:** Indicates the element is available for interaction but is not currently being interacted with.

### B. Hover
- **Visuals:** Slight darkening of background (`--color-primary-hover`) or elevation lift (`-translate-y-4px` with `--shadow-md`).
- **Rules:** Must only apply on devices that support hover (`@media (hover: hover)`). Must transition smoothly (`--duration-fast`).

### C. Focus / Focus-Visible
- **Visuals:** A 2px solid ring (`--color-border-focus` or primary) with a slight offset from the element.
- **Rules:** Must be clearly visible for keyboard navigation. Never use `outline: none` without providing a custom `box-shadow` focus ring.

### D. Active (Pressed)
- **Visuals:** Slight scale down (`transform: scale(0.97)`) to mimic physical depression.
- **Rules:** Provides immediate tactile feedback that a click/tap was registered.

### E. Disabled
- **Visuals:** Reduced opacity (`--opacity-disabled` = 0.5), cursor changes to `not-allowed`.
- **Rules:** The element cannot be interacted with or focused via keyboard.

### F. Loading
- **Visuals:** Content fades out or shifts, replaced by a Spinner or Shimmer effect. Pointer events are disabled.
- **Rules:** Must maintain the exact same physical dimensions as the Default state to prevent layout shift.

## 2. UI Copy Guidelines

Copy is a design element. It must be as carefully crafted as the CSS.

### A. Voice & Tone
- **Premium & Professional:** Avoid slang ("Awesome!", "Whoopsie"). Use clean, direct language.
- **Helpful:** Do not blame the user for errors. Provide solutions.

### B. Capitalization Rules
- **Title Case:** Used for Buttons, Navigation links, and page Headers (H1, H2). 
  - *Example: "Proceed to Checkout", "Order History"*
- **Sentence case:** Used for body text, form labels, descriptions, and error messages.
  - *Example: "Enter your shipping address", "Invalid email format."*
- **ALL CAPS:** Banned, except for small subheadings (eyebrow text) with increased letter-spacing (`0.05em`), such as category tags ("NEW ARRIVALS").

### C. Action-Oriented Buttons
Buttons must describe exactly what will happen when clicked.
- **Bad:** "Submit", "Go", "Next"
- **Good:** "Pay Now", "Add to Cart", "Apply Filter"

### D. Empty States & Errors
- **Empty Cart:** "Your cart is empty. Let's find some toys." (Includes a button: "Continue Shopping").
- **404 Page:** "Page not found. The link may be broken or the item removed." (Includes button: "Return Home").
- **Form Error:** "This field is required." (Attached directly below the specific input).
