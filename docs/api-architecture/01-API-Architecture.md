# API Architecture - Weebster

This document outlines the high-level architecture, design philosophy, and global standards for the Weebster REST API. It serves as the master contract between the Node.js backend and Next.js frontend.

---

## 1. Architecture Principles
- **RESTful by Default:** We follow strict REST conventions. URLs represent resources (nouns), and HTTP methods represent actions (verbs). We do not use RPC-style endpoints like `/api/getProducts`.
- **Statelessness:** The API is fundamentally stateless. Every request must contain all necessary authentication (JWT) and context. The server does not store in-memory session states.
- **Frontend Agnostic:** The API is designed to serve data, not HTML or UI-specific structures. It must be perfectly usable by a future React Native mobile app without modification.
- **Fail Fast, Fail Loud:** Validation errors are caught at the exact edge of the API (using Zod or Joi) before hitting any database logic. Errors return instantly with actionable HTTP status codes.

## 2. API Versioning Strategy
- **Base URL:** All API routes are prefixed with `/api/v1/`.
- **Why URL Versioning:** URL versioning (`/v1/`) is preferred over Header versioning (`Accept: application/vnd.weebster.v1+json`) because it is explicit, easier to debug via browser/Postman, and simplifies Next.js API route structuring.
- **Breaking Changes:** If a breaking change (e.g., removing a field, changing a data type) is required, a `/api/v2/` endpoint will be created. The `/v1/` endpoint will be maintained until all frontend clients have migrated.

## 3. Global Base URLs
- **Storefront API:** `/api/v1/store/...` (Public and Customer routes)
- **Admin API:** `/api/v1/admin/...` (Strictly protected staff routes)
- **Authentication:** `/api/v1/auth/...` (Login, Register, Password Reset)

## 4. HTTP Methods & Idempotency
| Method | Usage | Idempotent | Rules |
|--------|-------|------------|-------|
| **GET** | Retrieve a resource or collection. | Yes | Never mutates data. Safe to cache. |
| **POST** | Create a new resource or execute a complex action (e.g., Login). | No | Multiple POSTs create multiple resources unless protected by an Idempotency Key. |
| **PUT** | Completely replace an existing resource. | Yes | Must include the full resource payload. |
| **PATCH**| Partially update an existing resource. | Yes | Only includes fields that need changing. |
| **DELETE**| Soft-delete or hard-delete a resource. | Yes | Deleting an already deleted resource returns 200 OK or 404. |

## 5. Pagination, Sorting, and Filtering Strategy
Collections (e.g., `/api/v1/store/products`) use standardized query parameters.

### Pagination (Cursor Based Preferred for Storefront)
- `?cursor=154`: The ID of the last item received.
- `?limit=20`: Number of items to return (Max 100).
- *Admin routes may use Offset Pagination: `?page=2&limit=50`.*

### Sorting
- `?sort=price:asc`: Sort by price, ascending.
- `?sort=createdAt:desc`: Sort by creation date, descending.

### Filtering
- `?category=action-figures`: Filter by exact match.
- `?price[gte]=500&price[lte]=2000`: Filter by range (Greater Than or Equal, Less Than or Equal).

## 6. Future Expansion Strategy
- **Webhooks:** A dedicated `/api/v1/webhooks/` namespace will handle incoming asynchronous events from 3rd parties (Razorpay, Cloudinary) to decouple them from synchronous user flows.
- **GraphQL:** While strictly REST for V1, the underlying Controller and Service layer architecture is decoupled from the Express Request/Response objects, allowing a future Apollo GraphQL server to wrap the existing Services if needed.
