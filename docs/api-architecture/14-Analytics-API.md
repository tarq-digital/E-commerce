# Analytics API - Weebster

Provides aggregated data exclusively for the Admin Dashboard overview.

---

## 1. Get Dashboard Metrics (KPIs)
**Purpose:** Fetch the top-level numbers (Revenue, Orders, Users) for a specific date range.
- **Method:** `GET`
- **URL:** `/api/v1/admin/analytics/overview`
- **Authentication:** Required (Admin)
- **Query Parameters:** `startDate=2026-07-01`, `endDate=2026-07-16`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_revenue": 145000.00,
    "total_orders": 142,
    "new_customers": 45,
    "average_order_value": 1021.12,
    "revenue_growth_percentage": 12.4 // Compared to previous equivalent period
  }
}
```
**Performance Rule:** This endpoint executes multiple `COUNT()` and `SUM()` aggregate queries. It is computationally expensive. The backend controller should cache this response in memory (or Redis) for at least 5 minutes to prevent DB thrashing if multiple admins are refreshing the page.

## 2. Get Sales Chart Data
**Purpose:** Power the line charts (e.g., Revenue per day).
- **Method:** `GET`
- **URL:** `/api/v1/admin/analytics/sales-chart`
- **Authentication:** Required (Admin)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "date": "2026-07-01", "revenue": 12000.00 },
    { "date": "2026-07-02", "revenue": 15000.00 }
  ]
}
```

## 3. Get Top Selling Products
**Purpose:** Identify inventory that needs restocking.
- **Method:** `GET`
- **URL:** `/api/v1/admin/analytics/top-products`
- **Authentication:** Required (Admin)
- **Backend Flow:** Executes a `GROUP BY variant_id` on the `order_items` table, sorted by `SUM(quantity) DESC`, joined with the `products` table for names. Limit to top 10.
