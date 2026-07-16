# Banner & Content API - Weebster

Manages the dynamic UI elements on the Storefront Homepage.

---

## 1. List Active Banners (Storefront)
**Purpose:** Fetch the hero carousels and promotional graphics for the Homepage.
- **Method:** `GET`
- **URL:** `/api/v1/store/banners`
- **Authentication:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "image_url_desktop": "https://res.cloudinary.com/.../hero-marvel-desktop.jpg",
      "image_url_mobile": "https://res.cloudinary.com/.../hero-marvel-mobile.jpg",
      "alt_text": "Shop Marvel Toys",
      "target_url": "/category/marvel",
      "display_order": 1
    }
  ]
}
```
**Architecture Note:** Returning both a Desktop (16:9) and Mobile (1:1 or 4:5) image URL is critical for modern responsive design. The frontend `<picture>` tag handles the swap.

## 2. Manage Banners (Admin)
- **POST `/api/v1/admin/banners`:** Upload and configure a new banner.
- **PUT `/api/v1/admin/banners/reorder`:** Takes an array of IDs and updates `display_order` sequentially.
- **DELETE `/api/v1/admin/banners/:id`:** Remove a banner.

## 3. Future Scheduling (V2)
- Add `start_date` and `end_date` columns to the DB.
- The `GET /store/banners` endpoint will dynamically append `WHERE NOW() BETWEEN start_date AND end_date`, allowing Admins to upload a "Black Friday" banner in October that automatically appears on Friday and disappears on Monday.
