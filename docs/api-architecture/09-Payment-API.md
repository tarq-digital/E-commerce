# Payment API - Weebster

These endpoints handle the handshakes with third-party payment gateways (Razorpay).

---

## 1. Razorpay Webhook Listener
**Purpose:** An endpoint exposed to the internet, called explicitly by Razorpay when a payment succeeds or fails.
- **Method:** `POST`
- **URL:** `/api/v1/webhooks/razorpay`
- **Authentication:** Webhook Signature Verification (`x-razorpay-signature` header).

**Backend Flow:**
1. Verify the cryptographic signature using the `RAZORPAY_WEBHOOK_SECRET` env variable.
2. If invalid, return `400 Bad Request` immediately.
3. Parse payload for `event: payment.captured`.
4. Extract `payload.payment.entity.order_id` (e.g., `order_EKwx...`).
5. Query Database: `SELECT * FROM payments WHERE provider_order_id = ?`.
6. **Idempotency Check:** If `status === 'SUCCESS'`, return `200 OK` and halt.
7. Start Transaction.
8. Update `payments` to `SUCCESS` and store `provider_payment_id`.
9. Update `orders` to `PROCESSING`.
10. Update `inventory` to remove from `qty_reserved` (item is permanently sold).
11. Commit Transaction.
12. (Async) Trigger Order Success Email.

**Success Response (200 OK):**
Razorpay requires a 200 OK response within 3 seconds, or it will retry the webhook. Do not put long-running synchronous tasks (like generating PDF invoices) in this route.

## 2. Verify Payment (Frontend Polling/Confirmation)
**Purpose:** After the frontend Razorpay modal closes, the frontend needs to know if the backend successfully processed the webhook.
- **Method:** `POST`
- **URL:** `/api/v1/store/payments/verify`
- **Authentication:** Optional (Guest supported)

**Request Body:**
```json
{
  "order_number": "ORD-12345",
  "razorpay_payment_id": "pay_29QQo...",
  "razorpay_signature": "..."
}
```
**Why this exists:** Sometimes the webhook fails due to network issues. The frontend acts as a fallback mechanism, sending the signature and payment ID directly to the backend to force a verification check.

## 3. Retry Payment (Failure Recovery)
**Purpose:** If a user's card fails, they stay on the checkout page and can click "Try Again".
- **Method:** `POST`
- **URL:** `/api/v1/store/orders/:order_number/retry-payment`
- **Authentication:** Optional
- **Backend Flow:** Generates a NEW Razorpay `order_id` for the existing Weebster Order, creates a new `payments` row (Status: PENDING), and returns the new `provider_order_id` to the frontend.
