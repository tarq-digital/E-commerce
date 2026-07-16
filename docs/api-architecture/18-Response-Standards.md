# Response Standards - Weebster

Consistency is critical for developer experience (DX). The Weebster API enforces a single, immutable JSON envelope structure for EVERY response, whether it succeeds or fails.

---

## 1. The Global Response Envelope

### Success Response Format (2xx)
Every successful API response will wrap the data in a `data` key. This allows us to append metadata (pagination, warnings) without mutating the core object structure.

```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "meta": { ... } // Optional
}
```

### Error Response Format (4xx, 5xx)
Every error response will use a standard format, allowing the frontend to confidently parse `error.message` globally.

```json
{
  "success": false,
  "message": "A human-readable error message",
  "error_code": "RESOURCE_NOT_FOUND",
  "details": [] // Optional array for validation specifics
}
```

## 2. Resource Specific Standards

### Single Resource Retrieval (GET `/api/v1/store/products/123`)
```json
{
  "success": true,
  "message": "Product retrieved.",
  "data": {
    "id": 123,
    "name": "Spider-Man Figure",
    "price": 1500.00
  }
}
```

### Collection Retrieval with Pagination (GET `/api/v1/store/products`)
List responses MUST include a `meta` object with pagination details to allow frontend logic to render "Next Page" buttons safely.

```json
{
  "success": true,
  "message": "Products retrieved.",
  "data": [
    { "id": 1, "name": "Spider-Man" },
    { "id": 2, "name": "Batman" }
  ],
  "meta": {
    "pagination": {
      "total": 542,
      "limit": 20,
      "page": 1,
      "total_pages": 28,
      "has_next_page": true,
      "has_prev_page": false
    }
  }
}
```

### Creation Success (POST)
When a resource is created, the API MUST return the complete created object (including its newly generated `id` and `createdAt` timestamp).
**Status:** `201 Created`
```json
{
  "success": true,
  "message": "Address added successfully.",
  "data": {
    "id": 89,
    "street": "123 Main St",
    "is_default": true
  }
}
```

### Deletion Success (DELETE)
**Status:** `200 OK` (We prefer 200 with a JSON message over 204 No Content, as it simplifies frontend parsing).
```json
{
  "success": true,
  "message": "Product deleted successfully.",
  "data": null
}
```

## 3. Data Type Standardization
- **Monetary Values:** Always returned as `Number` (e.g., `1500.50`), strictly rounded to 2 decimal places. Never returned as strings unless specifically formatted for UI display by a localized helper field (e.g., `formatted_price: "₹1,500.50"`).
- **Dates/Timestamps:** Always returned in ISO 8601 UTC format (e.g., `"2026-07-16T10:00:00.000Z"`). The frontend is responsible for converting to local timezones.
- **Booleans:** Always strict `true` or `false`. Never `1` or `0`.
- **Nulls:** If a field has no value, return `null`. Do not omit the key from the JSON payload. This ensures the frontend TypeScript interfaces match exactly.
