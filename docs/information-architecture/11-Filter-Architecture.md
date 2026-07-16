# Filter Architecture - Weebster

Filtering is the mechanism by which users narrow down the catalog on `/shop`, `/category/:slug`, and `/search` pages. 

---

## 1. Filter Taxonomy

Filters are divided into standard facets based on the product schema.

| Facet | UI Component | Behavior |
|-------|--------------|----------|
| **Category** | Checkbox Group | Multi-select. `?category=action-figures,puzzles` |
| **Price** | Min/Max Inputs or predefined Radio buttons | Single range. `?minPrice=500&maxPrice=2000` |
| **Availability** | Toggle Switch | Boolean. `?inStock=true` (Hides out-of-stock items) |
| **Brand (Future)**| Checkbox Group | Multi-select. `?brand=hot-wheels,lego` |

## 2. URL Behavior & State Management
Filters MUST be driven by the URL, not isolated React state.
- **Why:** Allows users to share a link to a specific filtered view, and allows the browser's Back/Forward buttons to navigate filter states.
- **Implementation:** When a user clicks a filter, the frontend updates the URL query parameters. The page component (Server Component) reads these parameters and fetches the corresponding data from the database.

## 3. Combination Rules
- **AND within different facets:** Selecting `Category: Puzzles` AND `Price: < 1000` requires products to match BOTH conditions.
- **OR within the same facet:** Selecting `Category: Puzzles` AND `Category: Action Figures` requires products to match EITHER condition.

## 4. Sorting Strategy
Sorting reorganizes the current filtered dataset.
- **Options:** 
  - `Newest Arrivals` (Default)
  - `Price: Low to High`
  - `Price: High to Low`
  - `Name: A-Z`
- **URL Syntax:** `?sort=price-asc`, `?sort=createdAt-desc`.

## 5. Mobile vs Desktop Execution

### Desktop (Sidebar)
- Filters are constantly visible on the left.
- Updating a filter instantly updates the grid (debounced by 300ms) without a page reload, using Next.js shallow routing or SWR.

### Mobile (Drawer)
- Filters are hidden behind a "Filter & Sort" sticky button.
- **Performance Consideration:** Because mobile networks can be slow, toggling checkboxes inside the mobile drawer should NOT instantly trigger API calls. Instead, the drawer must have a sticky "Apply Filters" button at the bottom. The API call/URL update only happens when "Apply" is pressed.

## 6. Empty Results Handling
If a specific combination of filters results in 0 products:
1. Show a clear message: "No products match your current filters."
2. Provide a prominent "Clear All Filters" button that strips the URL query parameters and reloads the default category view.
