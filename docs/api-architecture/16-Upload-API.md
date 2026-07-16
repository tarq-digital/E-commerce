# Upload API - Weebster

Handles the secure uploading of media assets (Product Images, Banners) to Cloudinary.

---

## 1. Direct Upload (Frontend to Cloudinary) - PREFERRED
**Purpose:** Offload bandwidth and CPU usage from the Node.js server. Instead of sending a 5MB image to the Node server, the frontend uploads it directly to Cloudinary using a signed URL.

### Step 1: Request Signature
- **Method:** `GET`
- **URL:** `/api/v1/admin/upload/signature`
- **Authentication:** Required (Admin)
- **Backend Flow:** Node.js generates a cryptographic timestamped signature using the `CLOUDINARY_API_SECRET` and returns it.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "signature": "a1b2c3d4...",
    "timestamp": 1690000000,
    "api_key": "YOUR_KEY"
  }
}
```

### Step 2: Frontend Upload
The Next.js frontend takes the signature and `POST`s the file directly to `https://api.cloudinary.com/v1_1/weebster/image/upload`.
Cloudinary returns the secure URL, which the frontend then sends to the `/api/v1/admin/products` endpoint to save in the database.

## 2. Server-Side Upload (Fallback)
**Purpose:** If strict image manipulation or format conversion is required before uploading, the file passes through the Node server.
- **Method:** `POST`
- **URL:** `/api/v1/admin/upload/image`
- **Authentication:** Required (Admin)
- **Headers:** `Content-Type: multipart/form-data`

**Validation Limits (Multer):**
- **Max File Size:** 5MB.
- **Allowed Formats:** `image/jpeg`, `image/png`, `image/webp`.

## 3. Delete Image
**Purpose:** Remove an asset from Cloudinary to save storage costs when a product is deleted.
- **Method:** `DELETE`
- **URL:** `/api/v1/admin/upload/image`
- **Authentication:** Required (Admin)
- **Request Body:**
  ```json
  { "public_id": "products/spider-man-123" }
  ```
