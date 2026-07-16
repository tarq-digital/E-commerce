# Review API - Weebster

Handles user-generated feedback and ratings for products.

---

## 1. List Product Reviews
**Purpose:** Fetch approved reviews for the Product Details Page.
- **Method:** `GET`
- **URL:** `/api/v1/store/products/:product_id/reviews`
- **Authentication:** None
- **Query Parameters:** `page`, `limit=5`, `sort=created_at:desc`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 88,
      "rating": 5,
      "comment": "Amazing quality, my kid loves it!",
      "user_name": "John D.",
      "created_at": "2026-07-16T..."
    }
  ]
}
```
**Business Rule:** Only returns reviews where `is_approved = true`. The user's full name is masked (e.g., "John D.") for privacy.

## 2. Add Review
**Purpose:** Submit feedback.
- **Method:** `POST`
- **URL:** `/api/v1/store/products/:product_id/reviews`
- **Authentication:** Required (Customer)

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Amazing quality!"
}
```

**Backend Flow:**
1. Validate `rating` is an integer between 1 and 5.
2. Check if user actually purchased the product (Optional strict business rule: query `orders` -> `order_items`).
3. Insert review with `is_approved = false` (requires Admin moderation).
4. Do NOT instantly update the `products.average_rating` calculation until the review is approved.

## 3. Edit / Delete Review
- **Method:** `PUT` / `DELETE`
- **URL:** `/api/v1/store/reviews/:id`
- **Authentication:** Required (Customer)
- **Validation:** Must verify that the `user_id` of the review matches the authenticated token.

## 4. Admin: Approve Review
- **Method:** `PATCH`
- **URL:** `/api/v1/admin/reviews/:id/approve`
- **Authentication:** Required (Admin)
- **Backend Flow:** Sets `is_approved = true`. Triggers an async job to recalculate `products.average_rating` and `products.total_reviews` and update the `products` table.
