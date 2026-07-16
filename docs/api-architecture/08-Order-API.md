# Order API - Weebster

These endpoints manage the financial contract between the user and the platform.

---

## 1. Create Order (Checkout Initiation)
**Purpose:** Called when the user clicks "Pay Now" on the checkout page. Locks inventory and creates the `PENDING` order.
- **Method:** `POST`
- **URL:** `/api/v1/store/orders`
- **Authentication:** Optional (Guest Checkout Supported)

**Request Body:**
```json
{
  "shipping_address_id": 1, // If authenticated
  "guest_shipping_address": { ... }, // If Guest
  "contact_email": "user@example.com",
  "contact_phone": "+919876543210",
  "payment_method": "RAZORPAY",
  "coupon_code": "WEEBSTER10" // Optional
}
```
**Backend Flow:**
1. Validate Cart exists (DB or passed in for guest).
2. Start Transaction.
3. Verify `coupon_code` (if passed) and calculate Grand Total.
4. Verify Inventory `qty_available > 0` for all items.
5. Reserve Inventory (`qty_reserved + 1`, `qty_available - 1`).
6. Create `orders` row (Status: PENDING).
7. Create `order_items` snapshot rows.
8. Call Razorpay API to create an Order ID.
9. Commit Transaction.

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "order_id": "ORD-12345",
    "grand_total": 1500.00,
    "provider_order_id": "order_EKwxw..." // Passed to Frontend Razorpay Modal
  }
}
```
**Error Response (409 Conflict):** If Inventory check fails.

## 2. Get User Orders (History)
**Purpose:** Display order history in the dashboard.
- **Method:** `GET`
- **URL:** `/api/v1/store/orders`
- **Authentication:** Required (Customer)

**Query Parameters:**
- `page`: default 1

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "order_number": "ORD-12345",
      "status": "SHIPPED",
      "grand_total": 1500.00,
      "created_at": "2026-07-16T..."
    }
  ],
  "meta": { "pagination": { ... } }
}
```

## 3. Get Order Details
**Purpose:** Display full receipt (items, address, tracking).
- **Method:** `GET`
- **URL:** `/api/v1/store/orders/:order_number`
- **Authentication:** Required (Customer) OR Guest via Email/Phone verification.

## 4. Cancel Order
**Purpose:** Allow user to cancel before shipping.
- **Method:** `POST`
- **URL:** `/api/v1/store/orders/:order_number/cancel`
- **Authentication:** Required (Customer)
- **Business Rule:** Only allowed if `status` === `PENDING` or `PROCESSING`. If Razorpay payment was successful, triggers background refund job. Returns inventory to available pool.
