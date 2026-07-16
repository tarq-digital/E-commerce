# Form Design System - Weebster

Forms are critical for conversion (Checkout) and engagement (Registration). They must be frictionless, clearly validated, and accessible.

---

## 1. Core Form Elements

### A. Input (Text, Email, Password, Number)
- **Visuals:** 
  - Height: `44px` (Mobile minimum touch target).
  - Border: 1px solid `--color-border`.
  - Background: `--color-background`.
  - Border Radius: `--radius-md`.
- **States:**
  - *Focus:* 2px ring `--color-primary`.
  - *Error:* 1px solid `--color-error`.
  - *Disabled:* `--opacity-disabled`, background changes to `--color-secondary`.

### B. Textarea
- Same styling as Input, but `min-height: 120px` and `resize: vertical`.

### C. Select / Dropdown
- **Native Select:** Used on mobile for better OS-level native integration (wheel picker on iOS).
- **Custom Select:** Used on desktop for brand consistency.
- **Chevron:** Must include a custom chevron icon on the right side to indicate interactivity.

### D. Checkbox & Radio
- **Visuals:** 16x16px box/circle. 1px border.
- **Checked State:** Background fills with `--color-primary`. Checkmark/dot is white.
- **Interaction:** The `<label>` must wrap or be linked via `id` to the input so clicking the text toggles the input.

### E. Switch / Toggle
- Used for instant-save settings (e.g., "Subscribe to Newsletter" in Dashboard). Not used in standard form submissions.

## 2. Form Layout & Anatomy

A standard form group consists of 3 elements:
1. **Label:** `--text-sm`, `Inter Medium`. Must sit above the input.
2. **Input Field**
3. **Helper/Error Text:** `--text-xs`. Sits below the input.

### Spacing
- Gap between Label and Input: `--space-2` (8px).
- Gap between Input and Helper Text: `--space-1` (4px).
- Gap between separate Form Groups: `--space-6` (24px).

## 3. Validation & Feedback Rules

### Validation Timing
- **Inline Validation:** Validate fields `onBlur` (when the user clicks out). Do not validate `onChange` while the user is actively typing, as it causes premature error anxiety.
- **Submit Validation:** Re-validate all fields on form submit. Highlight the first invalid field and scroll it into view.

### Error Messages
- Must be explicitly descriptive.
  - *Bad:* "Invalid."
  - *Good:* "Password must be at least 8 characters long."
- Must be colored `--color-error` and ideally accompanied by a small alert icon for colorblind accessibility.

### Success States
- Forms generally do not need inline success states (green checkmarks) unless checking a unique value (e.g., "Username is available"). Success is communicated via the final form submission result (redirect or Toast).

## 4. Accessibility (Forms)
- Every `<input>` must have a corresponding `<label>`. Placeholder text is NOT a replacement for a label.
- Error messages must be linked to the input using `aria-describedby` so screen readers announce the error when the input is focused.
- `autocomplete` attributes must be used appropriately (e.g., `autocomplete="cc-number"` for credit cards, `autocomplete="shipping postal-code"` for checkout).
