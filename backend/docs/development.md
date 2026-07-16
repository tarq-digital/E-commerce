# Development Guide

## Request Lifecycle
Every request follows this strict flow:
1. **Security & Logging:** Helmet, CORS, Rate Limiter, Morgan, Winston Request Logger
2. **Parsing:** express.json, urlencoded
3. **Route Matching:** Express Router (`/api/v1/...`)
4. **Validation:** Joi schema evaluates `req.body` (Returns 400 if invalid)
5. **Authentication:** Extracts JWT from Cookie/Header.
6. **Authorization:** Checks RBAC (Admin vs Customer)
7. **Controller:** Extracts data, passes to Service, wraps Service output in JSON envelope.
8. **Service:** Executes business logic. Calls Repositories. Throws `ApiError`.
9. **Repository:** Executes raw `mysql2` queries. Returns sanitized data to Service.

## Adding a New Module (e.g. Products)
1. Add `constants/product-status.js` if needed.
2. Add `validators/product/create.schema.js`.
3. Add `database/repositories/product.repository.js`.
4. Add `services/product.service.js`.
5. Add `api/controllers/product.controller.js`.
6. Add `api/routes/product.routes.js`.
7. Register route in `api/routes/index.js`.
