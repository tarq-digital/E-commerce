# Wishlist API - Weebster

These endpoints allow authenticated customers to save products for later.

---

## 1. Get Wishlist
**Purpose:** Retrieve the user's saved items.
- **Method:** `GET`
- **URL:** `/api/v1/store/wishlist`
- **Authentication:** Required (Customer)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Wishlist retrieved.",
  "data": [
    {
      "wishlist_id": 12,
      "product": {
        "id": 101,
        "slug": "spider-man-action-figure",
        "name": "Spider-Man Action Figure",
        "base_price": 1500.00,
        "image_url": "..."
      },
      "added_at": "2026-07-16T10:00:00.000Z"
    }
  ]
}
```

## 2. Add to Wishlist
**Purpose:** Save a product.
- **Method:** `POST`
- **URL:** `/api/v1/store/wishlist`
- **Authentication:** Required (Customer)

**Request Body:**
```json
{
  "product_id": 101
}
```
**Business Rule:** Idempotent. If the product is already in the user's wishlist, return 200 OK without creating a duplicate database row.

## 3. Remove from Wishlist
**Purpose:** Un-save a product.
- **Method:** `DELETE`
- **URL:** `/api/v1/store/wishlist/:product_id`
- **Authentication:** Required (Customer)

## 4. Move Wishlist Item to Cart
**Purpose:** Quick action from the Wishlist UI.
- **Method:** `POST`
- **URL:** `/api/v1/store/wishlist/:product_id/move-to-cart`
- **Authentication:** Required (Customer)
- **Request Body:**
  ```json
  { "variant_id": 501 } // Optional if product only has 1 default variant
  ```
- **Backend Flow:**
  1. Verify variant exists.
  2. Add item to user's DB Cart (Quantity = 1).
  3. Delete item from user's Wishlist.
  4. Return success.
