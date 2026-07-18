# 03 Console Error Report

## Hydration Mismatch Warning
- **Error:** `Warning: Text content did not match. Server: "0" Client: "1"`
- **Trace:** `CartDrawer.js` -> `<CartProvider>`
- **Root Cause:** Next.js Server Components initially render an empty cart (0). When React hydrates the client, it immediately reads `localStorage` and finds 1 item.
- **Fix:** Wait for the `useEffect` hook to mount before syncing `localStorage` data to the UI state.

## Missing Key Prop
- **Error:** `Warning: Each child in a list should have a unique "key" prop.`
- **Trace:** `admin/orders/page.js` -> `.map()` rendering table rows.
- **Fix:** Add `key={order.id}` to the tr elements.
