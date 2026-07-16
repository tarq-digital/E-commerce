# Category API - Weebster

These endpoints provide the taxonomy structures required to render Navigation Menus and Breadcrumbs.

---

## 1. Get Category Tree
**Purpose:** Fetch the hierarchical tree of active categories for the Mega Menu and Mobile Drawer.
- **Method:** `GET`
- **URL:** `/api/v1/store/categories/tree`
- **Authentication:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Category tree retrieved.",
  "data": [
    {
      "id": 1,
      "name": "Action Figures",
      "slug": "action-figures",
      "children": [
        { "id": 12, "name": "Marvel", "slug": "marvel-action-figures" },
        { "id": 13, "name": "DC", "slug": "dc-action-figures" }
      ]
    },
    {
      "id": 2,
      "name": "Board Games",
      "slug": "board-games",
      "children": []
    }
  ]
}
```
**Performance Note:** This tree calculation is expensive if the table is large. In V1, we compute it on the fly. In V2, the backend will cache this JSON payload in Redis, invalidating the cache only when an Admin alters a category.

## 2. Get Category Details
**Purpose:** Fetch metadata for a specific category to render the Category Landing Page header (H1, Description, SEO).
- **Method:** `GET`
- **URL:** `/api/v1/store/categories/:slug`
- **Authentication:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Category retrieved.",
  "data": {
    "id": 1,
    "name": "Action Figures",
    "slug": "action-figures",
    "description": "Discover premium action figures...",
    "image_url": "https://res.cloudinary.com/.../banner.jpg"
  }
}
```
**Note:** The products belonging to this category are NOT returned here. The frontend must make a separate call to `/api/v1/store/products?category=action-figures`. This separation of concerns allows the frontend to paginate products independently of the category metadata.
