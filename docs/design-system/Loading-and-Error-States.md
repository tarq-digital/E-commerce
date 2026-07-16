# Loading & Error States - Weebster

Proper handling of delays and failures is what separates a premium application from a generic website. Weebster anticipates network latency and user errors.

---

## 1. Loading System

We strictly avoid full-page blank screens with a tiny spinner in the center. 

### A. Skeletons (Content Loading)
- **Usage:** Used for the initial page load of data-heavy components (Product Grids, Dashboard Tables).
- **Design:** Gray boxes (`--color-skeleton`) that match the exact height and width of the expected content.
- **Animation:** A subtle, horizontal shimmer effect to indicate the UI is actively fetching data, not frozen.
- **Benefit:** Eliminates Cumulative Layout Shift (CLS). The page structure exists before the data arrives.

### B. Spinners (Action Loading)
- **Usage:** Used inside buttons when a user submits a form (e.g., "Pay Now", "Login").
- **Design:** A simple, spinning SVG circle. Replaces the button text or sits adjacent to it.
- **Rule:** When a spinner is active, the button MUST be disabled to prevent double-submissions.

### C. Image Loading
- All product images must have a blurred placeholder or a skeleton background while the high-res WebP loads via Next.js `<Image>`.

## 2. Error System

Errors must be informative, polite, and actionable.

### A. Validation Errors (Form Level)
- Triggered `onBlur` or `onSubmit`.
- Red text (`--text-xs`) directly beneath the offending input.
- Input border changes to `--color-error`.

### B. Network / API Errors (Component Level)
- If a specific component fails to load (e.g., "Trending Products" API crashes), do not crash the whole page.
- React Error Boundaries catch the error and display a fallback UI in place of the component: a subtle card stating "Could not load products at this time" with a "Retry" button.

### C. Global Errors (Page Level)

#### 404 (Not Found)
- **Visuals:** Clean, branded page. Do not just say "404".
- **Copy:** "We can't find that page. It might have been moved or the toy is out of stock."
- **Action:** Prominent "Return to Shop" button.

#### 500 (Internal Server Error)
- **Visuals:** Apologetic illustration (e.g., a broken toy).
- **Copy:** "Something went wrong on our end. We've been notified and are fixing it."
- **Action:** "Refresh Page" button.

### D. Payment Failures
- The most critical error state.
- **Visuals:** Red alert box at the top of the checkout.
- **Copy:** "Your payment could not be processed. Please check your card details or try a different method. Your account has not been charged."
- **Action:** Do not clear the checkout form. Allow them to retry instantly.
