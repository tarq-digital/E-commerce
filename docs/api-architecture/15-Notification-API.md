# Notification API - Weebster

This is primarily an internal system API. The frontend does not usually trigger emails directly; emails are triggered as side-effects of other API calls (e.g., creating an order).

---

## 1. Email Trigger Points (Event Driven)

The Node.js backend will integrate with a transactional email provider (AWS SES, Resend, or SendGrid).

| Event Trigger | Recipient | Action Taken |
|---------------|-----------|--------------|
| `auth/register` | Customer | Send "Welcome to Weebster" email. |
| `orders` (Success) | Customer | Send "Order Confirmation" with HTML receipt. |
| `orders` (Success) | Admin | Send internal alert "New Order Received". |
| `admin/orders/status` | Customer | If status === `SHIPPED`, send "Your order is on the way" with tracking link. |
| `admin/orders/cancel` | Customer | Send "Order Cancelled / Refund Initiated". |

## 2. Send Custom Email (Admin Action)
**Purpose:** Allow admins to manually email a customer from the dashboard (e.g., addressing a complaint).
- **Method:** `POST`
- **URL:** `/api/v1/admin/notifications/email`
- **Authentication:** Required (Admin)

**Request Body:**
```json
{
  "user_id": 45,
  "subject": "Regarding your recent purchase",
  "html_body": "<p>Dear John...</p>"
}
```

## 3. Future Push Notifications (V2)
When Weebster expands to a React Native mobile app or PWA:
- **POST `/api/v1/auth/device-token`:** Saves the Firebase Cloud Messaging (FCM) or Apple APNS token to the `users` table.
- The trigger points above will be updated to fire both an Email Service and a Push Notification Service concurrently.
