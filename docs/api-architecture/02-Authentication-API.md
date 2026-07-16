# Authentication API - Weebster

Handles user identity, registration, and session management using JWTs in HttpOnly cookies.

---

## 1. Register User
**Purpose:** Create a new Customer account.
- **Method:** `POST`
- **URL:** `/api/v1/auth/register`
- **Authentication:** None

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe"
}
```
**Validation Rules:**
- `email`: Valid format, must be unique in DB.
- `password`: Min 8 chars, 1 uppercase, 1 number.
- `first_name`: Min 2 chars.

**Success Response (201 Created):**
Sets `access_token` HttpOnly Cookie.
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "user": { "id": 1, "email": "customer@example.com", "role": "CUSTOMER" }
  }
}
```

## 2. Login
**Purpose:** Authenticate an existing user and establish a session.
- **Method:** `POST`
- **URL:** `/api/v1/auth/login`
- **Authentication:** None

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!"
}
```
**Validation Rules:**
- `email`, `password`: Required.

**Success Response (200 OK):**
Sets `access_token` HttpOnly Cookie.
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": { "id": 1, "email": "customer@example.com", "role": "CUSTOMER" }
  }
}
```
**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password.",
  "error_code": "INVALID_CREDENTIALS"
}
```

## 3. Logout
**Purpose:** Terminate the session by clearing the JWT cookie.
- **Method:** `POST`
- **URL:** `/api/v1/auth/logout`
- **Authentication:** None (Safe to call even if not logged in).

**Success Response (200 OK):**
Clears `access_token` HttpOnly Cookie.
```json
{
  "success": true,
  "message": "Logged out successfully.",
  "data": null
}
```

## 4. Get Current User (Session Check)
**Purpose:** Called by the frontend on initial load to hydrate React Context with the logged-in user.
- **Method:** `GET`
- **URL:** `/api/v1/auth/me`
- **Authentication:** Required (Valid JWT Cookie)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User fetched.",
  "data": {
    "id": 1,
    "email": "customer@example.com",
    "first_name": "John",
    "role": "CUSTOMER"
  }
}
```
**Error Response (401 Unauthorized):**
Returned if cookie is missing or expired. Frontend should clear state.

## 5. Update Profile
**Purpose:** Allow user to change name or phone.
- **Method:** `PATCH`
- **URL:** `/api/v1/auth/profile`
- **Authentication:** Required (Valid JWT Cookie)

**Request Body:**
```json
{
  "first_name": "Johnny",
  "phone": "+919876543210"
}
```

## 6. Future Implementations (V2)
- **Forgot/Reset Password:** Will require an Email provider (SendGrid/AWS SES) to send magic links with short-lived tokens.
- **Refresh Tokens:** `POST /api/v1/auth/refresh` to rotate a short-lived (15 min) access token using a long-lived (7 day) refresh token stored in the database.
