# 06 Component Failure Report

## 1. `<CustomerNotesPanel>` (Missing)
- **Expected Location:** `frontend/src/app/(admin)/admin/customers/[id]/page.js`
- **Root Cause:** The database schema (`customer_notes`) was created in Phase 13.5 CRM module, but the corresponding React Component to view and submit notes was never built.

## 2. `<CartDrawer>` (Hydration Error)
- **Expected Location:** `frontend/src/components/features/CartDrawer.js`
- **Root Cause:** Renders data from `localStorage` immediately on mount, violating Next.js SSR hydration rules.
