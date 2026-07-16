# Component Library

## 1. Overview
The Weebster component library is built using React (Next.js) and Vanilla CSS Modules. Components are highly reusable, accept standard HTML attributes, and are strictly typed if using TypeScript/JSDoc.

## 2. Core Elements

### 2.1. Buttons (`Button.jsx`)
Handles user actions and form submissions.
**Props:**
- `variant`: 'primary', 'secondary', 'outline', 'ghost'
- `size`: 'sm', 'md', 'lg'
- `isLoading`: Boolean (Shows a spinner and disables button)
- `disabled`: Boolean
- `fullWidth`: Boolean

### 2.2. Inputs (`Input.jsx`)
Standard text fields for forms (Auth, Checkout).
**Props:**
- `label`: String
- `type`: 'text', 'password', 'email', 'number'
- `error`: String (Displays red border and error message below)
- `icon`: ReactNode (Optional left/right icon)

### 2.3. Select Dropdown (`Select.jsx`)
Custom styled select dropdown for variants and sorting.
**Props:**
- `options`: Array of `{ label, value }`
- `value`: Current selected value
- `onChange`: Callback function

---

## 3. E-commerce Specific Components

### 3.1. Product Card (`ProductCard.jsx`)
Displayed in grids (Home page, Shop page).
**Features:**
- Responsive image container (aspect ratio 1:1).
- Hover effect: Image slight zoom, card elevates.
- Details: Title, Price (with strike-through if discounted).
- Actions: "Quick Add to Cart" button on hover.
- Badges: "New" or "Out of Stock" positioned absolutely top-left.

### 3.2. Category Card (`CategoryCard.jsx`)
Visual navigation for shop categories.
**Features:**
- Large centralized image with a gradient overlay.
- Category name overlayed in white text (`Outfit` font).

### 3.3. Cart Item (`CartItem.jsx`)
Used inside the Cart Drawer and Checkout Page.
**Features:**
- Small thumbnail image.
- Title and variant details (e.g., "Red, Large").
- Quantity selector (`-` and `+` buttons).
- Remove item button (Trash icon).

---

## 4. Layout & Navigation

### 4.1. Navbar (`Navbar.jsx`)
**Desktop:** Logo left, Links center, Search/Cart/Profile right.
**Mobile:** Hamburger menu left (opens Drawer), Logo center, Cart right.
**Features:**
- Sticky positioning (`position: sticky; top: 0`).
- Glassmorphism effect (`backdrop-filter: blur(8px); background: rgba(255,255,255,0.8)`).
- Cart icon with a red notification dot indicating item count.

### 4.2. Footer (`Footer.jsx`)
Contains brand info, quick links, newsletter signup input, and social media icons.

### 4.3. Drawer (`Drawer.jsx`)
Sliding panel from the right or left.
Used for: Mobile Menu, Quick Cart View.
**Features:**
- Dark overlay behind drawer.
- Press `ESC` or click overlay to close.

---

## 5. Feedback & Loading

### 5.1. Loading Skeletons (`Skeleton.jsx`)
Replaces traditional spinners for a perceived performance boost.
**Types:**
- `SkeletonCard`: Matches the dimensions of a Product Card.
- `SkeletonText`: Matches standard heading/paragraph heights.
- Uses a CSS animation (`@keyframes shimmer`) sweeping across a gray background.

### 5.2. Toast Notifications (`ToastProvider.jsx`)
Temporary pop-up notifications at the bottom right.
**Usage:** "Item added to cart", "Profile updated", "Invalid login".

---

## 6. Admin Components
### 6.1. Admin Sidebar
Vertical navigation for the admin dashboard. Highlights current active route.

### 6.2. Data Table (`DataTable.jsx`)
Displays Orders, Products, and Customers.
**Features:**
- Sortable columns.
- Pagination controls.
- Search/Filter bar integrated.
- Action dropdowns (Edit, Delete, View) per row.
