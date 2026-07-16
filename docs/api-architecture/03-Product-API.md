# Product API (Storefront) - Weebster

These endpoints serve the public catalog. They are optimized for read performance, heavily relying on query parameters for filtering and sorting.

---

## 1. List Products (Catalog)
**Purpose:** Fetch products for the main shop page, categories, and search results.
- **Method:** `GET`
- **URL:** `/api/v1/store/products`
- **Authentication:** None

**Query Parameters (All Optional):**
- `page`: default 1
- `limit`: default 20
- `category`: string (slug)
- `search`: string (triggers FULLTEXT match)
- `min_price`: number
- `max_price`: number
- `sort`: `price:asc`, `price:desc`, `newest`, `rating`

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Products retrieved.",
  "data": [
    {
      "id": 101,
      "name": "Spider-Man Action Figure",
      "slug": "spider-man-action-figure",
      "base_price": 1500.00,
      "compare_price": 1999.00,
      "primary_image": "https://res.cloudinary.com/.../spiderman.jpg",
      "average_rating": 4.8
    }
  ],
  "meta": {
    "pagination": { "total": 45, "page": 1, "total_pages": 3 }
  }
}
```
**Performance Note:** This endpoint MUST NOT return the full `description` or `variants` arrays to keep the payload size minimal.

## 2. Get Product Details
**Purpose:** Fetch the complete data payload required to render the Product Details Page (PDP).
- **Method:** `GET`
- **URL:** `/api/v1/store/products/:slug`
- **Authentication:** None

**Path Parameters:**
- `slug`: The unique SEO-friendly string.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Product retrieved.",
  "data": {
    "id": 101,
    "name": "Spider-Man Action Figure",
    "slug": "spider-man-action-figure",
    "description": "Full HTML or Markdown description...",
    "base_price": 1500.00,
    "compare_price": 1999.00,
    "average_rating": 4.8,
    "total_reviews": 12,
    "category": { "id": 5, "name": "Action Figures", "slug": "action-figures" },
    "images": [
      { "url": "...", "is_primary": true },
      { "url": "...", "is_primary": false }
    ],
    "variants": [
      {
        "id": 501,
        "sku": "SPDR-RED",
        "name": "Red Suit",
        "price_override": null,
        "stock_status": "IN_STOCK" 
      }
    ]
  }
}
```
**Business Rule:** The `stock_status` is derived dynamically by the backend (`IN_STOCK` if `qty_available > 0`, else `OUT_OF_STOCK`). The exact numeric inventory count is intentionally hidden from the public to prevent competitor scraping.

## 3. Get Featured/New Arrivals
**Purpose:** Fetch curated lists for the Homepage.
- **Method:** `GET`
- **URL:** `/api/v1/store/products/featured`
- **Query Parameters:** `type=new_arrivals` | `type=best_sellers`

## 4. Get Related Products
**Purpose:** Drive cross-sells on the PDP.
- **Method:** `GET`
- **URL:** `/api/v1/store/products/:slug/related`
- **Business Rule:** Returns 4 products from the same category, excluding the current product.
