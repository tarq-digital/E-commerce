# Address API - Weebster

These endpoints allow users to manage their physical locations for billing and shipping.

---

## 1. List Addresses
**Purpose:** Fetch all saved addresses for the user dashboard and checkout selection modal.
- **Method:** `GET`
- **URL:** `/api/v1/store/addresses`
- **Authentication:** Required (Customer)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "label": "Home",
      "street": "123 MG Road",
      "city": "Raipur",
      "state": "Chhattisgarh",
      "pincode": "492001",
      "is_default": true
    }
  ]
}
```

## 2. Create Address
**Purpose:** Add a new address.
- **Method:** `POST`
- **URL:** `/api/v1/store/addresses`
- **Authentication:** Required (Customer)

**Request Body:**
```json
{
  "label": "Work",
  "street": "45 Tech Park",
  "city": "Raipur",
  "state": "Chhattisgarh",
  "pincode": "492015",
  "is_default": false
}
```
**Business Rule:** A user can have max 10 addresses. If `is_default` is `true`, the backend must automatically set `is_default = false` on all other addresses owned by this user in a single transaction.

## 3. Update Address
**Purpose:** Modify an existing address.
- **Method:** `PUT`
- **URL:** `/api/v1/store/addresses/:id`
- **Authentication:** Required (Customer)

**Validation:** Backend MUST ensure `address.user_id === req.user.id` to prevent users from altering other people's addresses.

## 4. Delete Address
**Purpose:** Remove an address.
- **Method:** `DELETE`
- **URL:** `/api/v1/store/addresses/:id`
- **Authentication:** Required (Customer)

## 5. Set Default Address
**Purpose:** Quick action from the dashboard to change the primary address.
- **Method:** `PATCH`
- **URL:** `/api/v1/store/addresses/:id/default`
- **Authentication:** Required (Customer)
- **Backend Flow:** Transactionally sets all other addresses to `false` and this ID to `true`.
