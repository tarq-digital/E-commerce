# API Specification - Weebster

This document details the RESTful API architecture for the Express.js backend. It outlines standard practices, authentication protocols, and core endpoints required for Version 1.

---

## 1. Global API Standards

### Base URL & Versioning
All API endpoints are prefixed with the API version to ensure backward compatibility for future mobile applications.
- **Base URL:** `/api/v1`

### Standard Response Format
All responses, regardless of success or failure, follow a strict JSON structure.
**Success Response (200, 201):**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "pagination": { "page": 1, "total": 50 } } // Optional
}
```
**Error Response (400, 401, 403, 404, 500):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [...] // Array of specific field errors
  }
}
```

### Authentication & Headers
- **Access Token:** Passed in the `Authorization` header as a Bearer token.
- **Refresh Token:** Handled automatically by the browser via `HttpOnly` cookie.
- **Content-Type:** `application/json` for all requests except file uploads (`multipart/form-data`).

### HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource created successfully.
- `400 Bad Request`: Validation failure or missing parameters.
- `401 Unauthorized`: Missing or invalid Access Token.
- `403 Forbidden`: Token is valid, but user lacks `ADMIN` role.
- `404 Not Found`: Resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Backend crash.

### Pagination, Sorting, and Filtering
- **Query Params:** `?page=1&limit=20&sort=-createdAt&category=action-figures`
- Prefixing sort field with `-` denotes descending order.

---

## 2. Core Endpoints (V1)

### A. Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Create a new customer account | No |
| `POST` | `/login` | Authenticate user, return JWT & set cookie | No |
| `POST` | `/refresh` | Generate new access token via HttpOnly cookie | No |
| `POST` | `/logout` | Clear refresh token cookie | Yes |
| `GET`  | `/me` | Fetch logged-in user profile | Yes |

### B. Products (`/api/v1/products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/` | List products (Supports pagination/filters) | No |
| `GET`  | `/:slug` | Get single product details | No |
| `POST` | `/` | Create a new product | Yes (Admin) |
| `PUT`  | `/:id` | Update product details | Yes (Admin) |
| `DELETE`| `/:id` | Soft delete a product | Yes (Admin) |

### C. Categories (`/api/v1/categories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/` | List all categories | No |
| `POST` | `/` | Create a category | Yes (Admin) |
| `PUT`  | `/:id` | Update a category | Yes (Admin) |

### D. Cart (`/api/v1/cart`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/` | Get current user's cart | Yes |
| `POST` | `/` | Add item to cart | Yes |
| `PUT`  | `/:itemId`| Update quantity of cart item | Yes |
| `DELETE`| `/:itemId`| Remove item from cart | Yes |

### E. Checkout & Orders (`/api/v1/orders`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/` | Initialize order & get Razorpay ID | Yes |
| `POST` | `/verify` | Webhook/Client endpoint to verify payment | No/Yes |
| `GET`  | `/` | Get logged-in user's order history | Yes |
| `GET`  | `/:id` | Get specific order details | Yes |
| `GET`  | `/admin/all`| List all orders (Admin Dashboard) | Yes (Admin) |
| `PUT`  | `/:id/status`| Update order status | Yes (Admin) |

### F. User Addresses (`/api/v1/addresses`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/` | List user's saved addresses | Yes |
| `POST` | `/` | Save a new address | Yes |
| `PUT`  | `/:id` | Update address | Yes |
| `DELETE`| `/:id` | Delete address | Yes |

### G. Media (`/api/v1/media`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/upload` | Upload image to Cloudinary, return URL | Yes (Admin) |

---

## 3. Error Validation Examples
Using Zod middleware, invalid payloads will fail before hitting the controller.

**Request:** `POST /api/v1/auth/register`
```json
{
  "email": "invalid-email",
  "password": "123"
}
```

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid request parameters",
    "details": [
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "password", "message": "Password must be at least 8 characters" }
    ]
  }
}
```
