# User Journeys - Weebster

This document outlines the high-level psychological and navigational paths different archetypes take through the platform. It focuses on *why* a user does something and *how* the IA supports that goal.

---

## 1. The Guest Buyer (High Intent)
**Goal:** Wants to buy a specific toy as a gift as quickly as possible.
- **Entry:** Lands on `/product/[slug]` via a Google Search for "Buy Hot Wheels Track India".
- **Decision Point 1:** Evaluates price, images, and stock. IA provides sticky "Add to Cart" button.
- **Journey:** Clicks "Add to Cart". Cart Drawer opens.
- **Decision Point 2:** Sees subtotal. Clicks "Checkout".
- **Journey:** Lands on `/checkout`. Chooses "Checkout as Guest" to avoid friction. Inputs address, pays via Razorpay.
- **Exit:** Lands on `/checkout/success`. 
- **Recovery Path:** If they abandon cart, the local storage preserves the cart for their next visit.

## 2. The Returning Collector (Browsing)
**Goal:** Wants to see what's new in their favorite category (e.g., Anime Figures).
- **Entry:** Lands on `/` (Homepage) via bookmark or direct typing.
- **Journey:** Navigates via Mega Menu -> "Categories" -> "Anime Figures".
- **Decision Point 1:** Scans the `/category/anime-figures` page. Uses the sidebar to filter by `Price: High to Low` and `In Stock Only`.
- **Journey:** Clicks the Wishlist (heart) icon on 3 different products directly from the grid.
- **Exit:** Leaves the site.
- **Failure Path:** If they try to wishlist while not logged in, the IA triggers a modal: "Please login to save to your wishlist," intercepting the action gracefully.

## 3. The Customer Service / Admin User
**Goal:** A customer called complaining their order hasn't arrived. Admin needs to check status.
- **Entry:** Logs into `/admin/login`.
- **Journey:** Lands on `/admin` dashboard. Clicks "Orders" in the sidebar.
- **Decision Point 1:** Uses the Global Search bar in the header to paste the Order ID (`WB-100452`).
- **Journey:** Clicks the resulting row to enter `/admin/orders/WB-100452`. Views tracking info.
- **Exit:** Updates the order status to "Shipped" and logs out.

## 4. The Frustrated User (Error Recovery)
**Goal:** Clicked an old link from a marketing email for a product that was deleted.
- **Entry:** Hits `/product/old-sold-out-toy`.
- **Journey:** IA routes them to the `not-found.tsx` (404 Page).
- **Decision Point:** The 404 page does not leave them stranded. It displays a "Search" bar and a grid of "Trending Products".
- **Recovery Path:** User searches for a similar term, landing on `/search?q=toy`, recovering the session instead of bouncing.
