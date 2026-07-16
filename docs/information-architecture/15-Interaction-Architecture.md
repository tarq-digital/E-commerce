# Interaction Architecture - Weebster

This document governs how the system responds to user inputs. It defines the patterns for success, failure, confirmation, and destructive actions.

---

## 1. Action Hierarchy

### Primary Actions
- **Definition:** The single most important action on a screen (e.g., "Add to Cart", "Pay Now", "Save Product").
- **Interaction:** Uses the solid Primary button style. Triggers immediate system state change or navigation. Only ONE primary action should exist per view block.

### Secondary Actions
- **Definition:** Alternative paths (e.g., "Continue Shopping", "Cancel", "Add to Wishlist").
- **Interaction:** Uses Outline or Ghost button styles. 

## 2. Feedback & Notifications

### Toast Notifications
- **Usage:** Non-blocking, temporary feedback for successful actions or minor errors.
- **Positioning:** Bottom-center on Mobile (thumb friendly). Top-right on Desktop (eye level).
- **Duration:** Disappears automatically after 3000ms.
- **Examples:** "Added to Cart", "Address Saved", "Invalid Coupon Code".

### Inline Validation
- **Usage:** Used exclusively in forms.
- **Interaction:** Evaluates on `onBlur` (when focus leaves the input). Displays a red error message directly below the field. Does not use Toasts to report form validation errors, as that divorces the error from the context.

## 3. Destructive Flows & Confirmation

### The "Undo" Pattern (Preferred)
- For non-critical destructive actions (e.g., Removing an item from the Cart, deleting a Wishlist item), do not interrupt the user with an "Are you sure?" modal.
- Instead, perform the action immediately and provide a Toast notification with an "Undo" button that lasts for 5 seconds.

### The "Confirmation Modal" Pattern (Admin)
- For critical, irreversible database actions (e.g., Deleting a Product, Cancelling an Order), the Undo pattern is insufficient.
- **Interaction:** Clicking the delete button opens a center-screen Modal.
- **Copy:** "Are you sure you want to delete [Product Name]? This action cannot be undone."
- **Actions:** 
  - `Cancel` (Ghost button, default focus).
  - `Delete Permanently` (Red error button, requires explicit click).

## 4. Loading Interactions

### Optimistic UI
- For actions with high probability of success (e.g., Liking a product), update the UI instantly before the API call finishes. If the API fails, revert the UI and show a Toast error. This makes the app feel lightning fast.

### Blocking UI
- For critical actions (e.g., "Pay Now"), do NOT use Optimistic UI.
- **Interaction:** Click "Pay Now" -> Button text changes to a Spinner -> Button becomes disabled so they can't click it twice -> Wait for Razorpay -> Proceed.
