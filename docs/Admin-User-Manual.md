# Admin User Manual - Weebster

Welcome to the Weebster Admin Dashboard. This guide will help you manage your store, products, orders, and customers effectively.

## 1. Accessing the Dashboard
- **URL:** Navigate to `https://weebster.in/admin-login` (Note: Link hidden from normal customers).
- **Credentials:** Use your provided Admin Email and Password.
- *Security Note: Do not share these credentials. The system logs who makes changes.*

## 2. Dashboard Overview
Upon logging in, you will see the Overview screen:
- **Total Sales:** Revenue for the current month.
- **Active Orders:** Orders awaiting fulfillment.
- **Low Stock Alerts:** Items that have 5 or fewer units remaining.

## 3. Managing Products
### 3.1. Adding a New Product
1. Go to **Catalog > Products**.
2. Click **"+ Add New Product"**.
3. **Basic Info:** Enter Title, Description, and select a Category.
4. **Images:** Click the upload box to add images. Drag to reorder. The first image is the primary thumbnail.
5. **Variants & Pricing:** 
   - If the product has no variants (e.g., one size/color), leave variants empty and enter the Base Price and Stock.
   - If it has variants (e.g., "Red", "Blue"), add them here. Each variant needs its own SKU, Price, and Stock quantity.
6. Click **"Publish"** to make it live, or **"Save as Draft"**.

### 3.2. Updating Inventory
- To quickly update stock, go to **Catalog > Inventory**.
- Search for the product or SKU, update the number in the input box, and click "Save".

## 4. Managing Categories
1. Go to **Catalog > Categories**.
2. To create a new category (e.g., "Board Games"), click **"Add Category"**.
3. Provide a Name and upload a representative Category Image.
4. Ensure "Status" is set to Active.

## 5. Managing Orders
1. Go to **Sales > Orders**.
2. You will see a list of orders. Click on an Order ID to view details.
3. **Order Statuses:**
   - **Pending:** Order received, payment verified, awaiting action.
   - **Processing:** You are currently packing the item.
   - **Shipped:** The item has been handed to the courier. (You can add a Tracking Link here).
   - **Delivered:** The customer has received the item.
4. *Note: Changing the status to "Shipped" automatically sends an email/notification to the customer.*

## 6. Marketing & Promotions
### 6.1. Banners
1. Go to **Marketing > Banners**.
2. Upload promotional images for the homepage slider.
3. Add a "Link URL" so clicking the banner takes the user to a specific product or category.
4. Use the toggle to turn banners On/Off without deleting them.

### 6.2. Coupons
1. Go to **Marketing > Coupons**.
2. Click **"Create Coupon"**.
3. **Code:** e.g., `DIWALI20`
4. **Type:** Percentage (e.g., 20%) or Flat amount (e.g., ₹500).
5. **Limits:** Set an expiration date and minimum cart value. You can also limit total usages (e.g., "First 100 customers").

## 7. Moderating Reviews
1. Go to **Customers > Reviews**.
2. All new reviews are marked as "Pending Approval".
3. Read the review. Click the **Approve** button to show it on the website, or **Hide** if it contains spam or inappropriate language.

## 8. Troubleshooting
- **Images not uploading:** Ensure the file size is under 5MB and is a standard format (JPG, PNG, WebP).
- **Customer says payment failed but money deducted:** Check the Razorpay Dashboard. If Razorpay shows successful, it will auto-refund the customer within 5-7 days if the order wasn't created on Weebster.
- **Website looks broken:** Try clearing your browser cache (Ctrl+Shift+R or Cmd+Shift+R).
