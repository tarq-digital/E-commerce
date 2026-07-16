# Product Architecture - Weebster

This document details the highly normalized structure designed to support a scalable catalog of physical goods.

---

## 1. The Core Catalog Trinity

E-commerce systems fail when products and their variations are not modeled correctly. Weebster uses a 3-tier structure:

1. **`products`:** The abstract concept (e.g., "T-Shirt" or "Hot Wheels Car"). Holds common data: Name, Base Price, Category, Description.
2. **`variants`:** The specific, purchasable physical item (e.g., "Red / Large" or "Blue Car"). Holds: SKU, Price Overrides.
3. **`inventory`:** The physical count of the variant.

## 2. Handling Variants (The E-commerce Hard Problem)
A product might come in Colors (Red, Blue) and Sizes (S, M, L).
- **V1 (Current Implementation):** We use a simple `name` field on the `variants` table (e.g., "Red - Large"). This is sufficient for the initial 50 products and simple toy variations.
- **V2 (Future Expansion - EAV Model):** As we expand to clothing or highly variable products, we will introduce `variant_attributes` (e.g., "Color") and `variant_values` (e.g., "Red"). 
  - `variants` will bridge to `variant_values` in a Many-to-Many relationship, allowing complex UI filtering (e.g., "Show me all RED products"). The current V1 architecture reserves space for this without requiring a rewrite of the base `products` table.

## 3. Product Pricing Strategy
- **`base_price` (products):** The default price if a variant doesn't have an override.
- **`price_override` (variants):** Allow specific variants to cost more (e.g., "Limited Edition Gold Variant" costs +₹500).
- **`compare_price` (products):** The "fake" original price used to show a strikethrough discount (e.g., ~~₹1999~~ ₹1499).

## 4. Unlimited Images
- Image URLs are stored in the `product_images` table, linked via `product_id` (One-to-Many).
- **`display_order` (INT):** Allows admins to drag-and-drop the image order.
- **`is_primary` (BOOLEAN):** Quick identifier for the grid thumbnail without relying on sorting logic.

## 5. Future Feature Readiness
- **Digital Products:** Add an `is_digital` boolean to `variants` and an `asset_url` column.
- **Bundles:** Add a `product_bundles` many-to-many join table (`bundle_id`, `component_product_id`).
- **Brands:** Currently omitted for MVP. Can easily be added via a `brands` table and a `brand_id` FK on the `products` table.
