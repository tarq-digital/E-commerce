# Developer Guidelines (API) - Weebster

This document translates the API Architecture into strict rules for backend and frontend engineers.

---

## 1. Routing & Naming Rules
- Use lowercase and hyphens (kebab-case) for all URLs: `/api/v1/store/action-figures`. Never `/api/v1/store/ActionFigures`.
- Use plural nouns for resources: `/api/v1/store/users`, not `/api/v1/store/user`.

## 2. Controller & Service Separation
- **Controllers (`product.controller.ts`):** 
  - ONLY responsible for extracting data from the Express `req` (params, body, user).
  - ONLY responsible for formatting the standard JSON response envelope.
  - MUST NOT contain business logic or Prisma queries.
- **Services (`product.service.ts`):**
  - Contains all business logic and Prisma queries.
  - Has NO knowledge of Express, `req`, or `res`. It just takes parameters and returns raw data or throws specific Error classes.
  - *Why:* If we ever switch from Express to Fastify, or from REST to GraphQL, the Service layer remains 100% untouched.

## 3. Error Handling Rules
- Never use `try/catch` inside every single controller.
- Use a wrapper function `catchAsync(fn)` around controllers to pass errors to the Global Error Handler middleware.
- In Services, throw specific custom errors: `throw new ApiError(404, 'Product not found', 'RESOURCE_NOT_FOUND')`.

## 4. Response Wrapping Rule
- Never send raw arrays or objects from a controller: `res.json(products)`.
- Always use the standardized helper:
  ```javascript
  return res.status(200).json({
    success: true,
    message: 'Success',
    data: products
  });
  ```

## 5. Definition of Done (API Endpoint)
Before a backend PR is approved for a new endpoint, verify:
- [ ] Is the route added to the Postman Workspace / Swagger documentation?
- [ ] Is the input validated using a Zod schema?
- [ ] Does it return the standard JSON envelope?
- [ ] If it mutates data, is it protected by appropriate Role authorization (`requireCustomer` or `requireAdmin`)?
- [ ] Are errors handled gracefully without leaking stack traces?

## 6. Frontend Integration Rules
- Frontend engineers MUST NOT hardcode API URLs in components.
- Use an `apiClient.ts` (Axios instance) configured with `withCredentials: true` and the correct `baseURL`.
- Map the standard JSON envelope explicitly: `const products = response.data.data;`.
