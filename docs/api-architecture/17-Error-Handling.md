# Error Handling Architecture - Weebster

This document dictates how backend failures are communicated to the frontend. Consistent error handling allows the frontend to build global Axios interceptors for authentication drops, toasts, and form validation.

---

## 1. HTTP Status Code Mapping
The backend strictly adheres to semantic HTTP status codes.

| Status Code | Usage | Frontend Reaction |
|-------------|-------|-------------------|
| `400 Bad Request` | Validation failed, missing parameters. | Highlight specific form fields. |
| `401 Unauthorized` | Invalid/Missing JWT token. | Redirect to `/login`. Clear local user state. |
| `403 Forbidden` | Valid token, but lacks permissions (e.g., Customer trying to hit Admin route). | Show "Access Denied" or redirect to `/`. |
| `404 Not Found` | Resource ID does not exist. | Render 404 page or component fallback. |
| `409 Conflict` | Business logic violation (e.g., Email already exists, Out of Stock). | Show Toast notification. |
| `422 Unprocessable`| (Optional) Often used interchangeably with 400 for strict validation errors. | Highlight form fields. |
| `429 Too Many Req` | Rate limit exceeded. | Show "Please try again later" Toast. |
| `500 Internal Error`| Unhandled backend exception or Database crash. | Show generic "Something went wrong" Toast. |

## 2. Validation Errors Format (400 Bad Request)
When the Zod/Joi validation layer catches bad input, it MUST format the errors into an actionable array for the frontend forms.

```json
{
  "success": false,
  "message": "Validation failed. Please check your inputs.",
  "error_code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Must be a valid email address."
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters."
    }
  ]
}
```
**Frontend Benefit:** The frontend can easily map `error.details.find(e => e.field === 'email').message` to the Email input UI.

## 3. Business Logic Errors Format (409 Conflict)
When input is structurally valid, but violates business rules (e.g., trying to checkout an item that sold out a millisecond ago).

```json
{
  "success": false,
  "message": "The item 'Spider-Man Figure' is no longer in stock.",
  "error_code": "INSUFFICIENT_INVENTORY",
  "data": {
    "variant_id": 45,
    "available_qty": 0
  }
}
```

## 4. Internal Server Errors Format (500)
For uncaught exceptions, the API MUST NOT leak stack traces to the public response.

**Development Environment (NODE_ENV=development):**
```json
{
  "success": false,
  "message": "Database Connection Refused",
  "error_code": "INTERNAL_SERVER_ERROR",
  "stack": "Error: Connect ECONNREFUSED...\n at Object... "
}
```

**Production Environment (NODE_ENV=production):**
```json
{
  "success": false,
  "message": "An unexpected error occurred. Our team has been notified.",
  "error_code": "INTERNAL_SERVER_ERROR"
}
```

## 5. Standard Error Codes
Use predefined uppercase snake_case strings for `error_code` so the frontend can programmatically react to errors without parsing strings (which might change due to localization).

- `INVALID_CREDENTIALS` (Login failed)
- `TOKEN_EXPIRED` (Trigger refresh flow)
- `RESOURCE_NOT_FOUND`
- `INSUFFICIENT_INVENTORY`
- `PAYMENT_GATEWAY_ERROR`
- `COUPON_EXPIRED`
- `COUPON_INVALID`
