# Coupon API - Weebster

These endpoints allow users to apply discounts during checkout and allow admins to manage the rules engine.

---

## 1. Validate & Apply Coupon
**Purpose:** Called when a user types a code into the Cart/Checkout drawer. Evaluates rules and returns the calculated discount without permanently saving it.
- **Method:** `POST`
- **URL:** `/api/v1/store/coupons/validate`
- **Authentication:** Optional

**Request Body:**
```json
{
  "code": "WEEBSTER10",
  "cart_subtotal": 2500.00
}
```

**Backend Flow:**
1. Fetch coupon from DB by `code`. If null -> `404 Not Found`.
2. Check `is_active === true`. If false -> `400 Bad Request` ("Coupon inactive").
3. Check `expiry_date > NOW()`. If false -> `400 Bad Request` ("Coupon expired").
4. Check `used_count < usage_limit`. If false -> `400 Bad Request` ("Usage limit reached").
5. Check `cart_subtotal >= min_order_value`. If false -> `400 Bad Request` ("Add ₹500 more to use this code").
6. Calculate discount amount. If percentage, cap at `max_discount`.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "code": "WEEBSTER10",
    "discount_amount": 250.00,
    "discount_type": "PERCENTAGE",
    "message": "10% off applied!"
  }
}
```
**Frontend Interaction:** The frontend uses `discount_amount` to re-render the Cart Totals dynamically. The actual application of the coupon to the database happens during the `/api/v1/store/orders` (Create Order) call.
