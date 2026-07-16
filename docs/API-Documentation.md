# API Documentation

Base URL: `https://api.weebster.in/api/v1`

## 1. Authentication APIs

### 1.1 Register User
- **Method:** `POST`
- **URL:** `/auth/register`
- **Body:**
  ```json
  {
    "first_name": "Rahul",
    "last_name": "Sharma",
    "email": "rahul@example.com",
    "password": "SecurePassword123",
    "phone": "9876543210"
  }
  ```
- **Success Response (201 Created):** Returns user object and sets HTTP-Only cookie with JWT.
- **Error Response (400 Bad Request):** Validation errors (e.g., Email already exists).

### 1.2 Login User
- **Method:** `POST`
- **URL:** `/auth/login`
- **Body:**
  ```json
  {
    "email": "rahul@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response (200 OK):** Sets JWT HTTP-Only cookie, returns `{ user: { id, role, name, email } }`.
- **Error Response (401 Unauthorized):** Invalid credentials.

### 1.3 Logout
- **Method:** `POST`
- **URL:** `/auth/logout`
- **Success Response (200 OK):** Clears JWT cookie.

### 1.4 Get Current User (Me)
- **Method:** `GET`
- **URL:** `/auth/me`
- **Headers:** Includes Cookie
- **Success Response (200 OK):** Returns current authenticated user data.

---

## 2. Product APIs

### 2.1 Get All Products
- **Method:** `GET`
- **URL:** `/products`
- **Query Params:** `?category=action-figures&sort=price_asc&page=1&limit=20`
- **Success Response (200 OK):**
  ```json
  {
    "data": [ { "id": 1, "name": "Naruto Figure", "base_price": 1500, "slug": "naruto-figure", "image": "..." } ],
    "pagination": { "total": 150, "page": 1, "limit": 20, "totalPages": 8 }
  }
  ```

### 2.2 Get Product by Slug
- **Method:** `GET`
- **URL:** `/products/slug/:slug`
- **Success Response (200 OK):** Detailed product object including variants and images.

### 2.3 Create Product (Admin Only)
- **Method:** `POST`
- **URL:** `/products`
- **Headers:** Cookie (Admin JWT)
- **Body:** Complex object containing base details, variants, and specifications.
- **Success Response (201 Created):** Returns created product ID.

---

## 3. Category APIs

### 3.1 Get All Categories
- **Method:** `GET`
- **URL:** `/categories`
- **Success Response (200 OK):** Returns hierarchical list of active categories.

---

## 4. Order APIs

### 4.1 Create Order
- **Method:** `POST`
- **URL:** `/orders`
- **Headers:** Cookie (User JWT)
- **Body:**
  ```json
  {
    "address_id": 2,
    "coupon_code": "WEEB10",
    "payment_method": "razorpay"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "order_id": 1024,
    "razorpay_order_id": "order_H8k...",
    "amount": 2500,
    "currency": "INR"
  }
  ```

### 4.2 Verify Payment
- **Method:** `POST`
- **URL:** `/orders/verify-payment`
- **Body:**
  ```json
  {
    "razorpay_order_id": "order_H8k...",
    "razorpay_payment_id": "pay_H8l...",
    "razorpay_signature": "signature_hash..."
  }
  ```
- **Success Response (200 OK):** Updates order status to 'paid'.

### 4.3 Get User Orders
- **Method:** `GET`
- **URL:** `/orders/my-orders`
- **Headers:** Cookie (User JWT)
- **Success Response (200 OK):** List of user's past orders.

---

## 5. Cart APIs

### 5.1 Add to Cart
- **Method:** `POST`
- **URL:** `/cart/items`
- **Headers:** Cookie (User JWT)
- **Body:** `{ "product_variant_id": 5, "quantity": 1 }`
- **Success Response (200 OK):** Updated cart object.

---

## 6. Admin APIs

### 6.1 Dashboard Statistics
- **Method:** `GET`
- **URL:** `/admin/stats`
- **Headers:** Cookie (Admin JWT)
- **Success Response (200 OK):** `{ "total_sales": 150000, "total_orders": 120, "low_stock_items": 5 }`

### 6.2 Update Order Status
- **Method:** `PATCH`
- **URL:** `/admin/orders/:id/status`
- **Headers:** Cookie (Admin JWT)
- **Body:** `{ "order_status": "shipped" }`
- **Success Response (200 OK):** Order updated successfully.

## 7. Common Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource created successfully.
- `400 Bad Request`: Invalid input or validation failure.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: User authenticated but lacks required permissions (e.g., not an admin).
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Backend logic failure.
