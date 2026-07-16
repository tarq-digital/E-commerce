# Cart API - Weebster

The Cart API is unique. Unauthenticated Guests use local storage (`localStorage`) entirely. Only authenticated users interact with these API endpoints to persist their cart to the database across devices.

---

## 1. Get Cart
**Purpose:** Retrieve the user's saved cart and calculate current totals.
- **Method:** `GET`
- **URL:** `/api/v1/store/cart`
- **Authentication:** Required (Customer)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart retrieved.",
  "data": {
    "items": [
      {
        "cart_item_id": 45,
        "variant": {
          "id": 501,
          "sku": "SPDR-RED",
          "name": "Red Suit",
          "product_name": "Spider-Man Figure",
          "price": 1500.00,
          "image_url": "..."
        },
        "quantity": 2,
        "item_total": 3000.00
      }
    ],
    "summary": {
      "subtotal": 3000.00,
      "discount_total": 0.00,
      "grand_total": 3000.00
    }
  }
}
```
**Business Rule:** The backend calculates prices dynamically based on the current product price in the DB. The frontend must NEVER send price calculations.

## 2. Add Item to Cart
**Purpose:** Add a specific variant to the DB cart.
- **Method:** `POST`
- **URL:** `/api/v1/store/cart/items`
- **Authentication:** Required (Customer)

**Request Body:**
```json
{
  "variant_id": 501,
  "quantity": 1
}
```

## 3. Update Item Quantity
**Purpose:** Adjust quantity (+/-) in the cart drawer.
- **Method:** `PATCH`
- **URL:** `/api/v1/store/cart/items/:cart_item_id`

**Request Body:**
```json
{
  "quantity": 3
}
```

## 4. Remove Item from Cart
**Purpose:** Delete a specific item line.
- **Method:** `DELETE`
- **URL:** `/api/v1/store/cart/items/:cart_item_id`

## 5. Merge Guest Cart (Critical Interaction)
**Purpose:** When a Guest has items in `localStorage` and then Logs In or Registers, the frontend must push the local cart to the database.
- **Method:** `POST`
- **URL:** `/api/v1/store/cart/merge`
- **Authentication:** Required (Customer)

**Request Body:**
```json
{
  "local_cart_items": [
    { "variant_id": 501, "quantity": 1 }
  ]
}
```
**Business Rule:** The backend will check if the user already has a DB cart. If yes, it adds the local items, combining quantities if the variant already exists in the DB cart.
