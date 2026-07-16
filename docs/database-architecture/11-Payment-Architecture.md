# Payment Architecture - Weebster

This document details the data structures required to integrate securely with external payment gateways (Razorpay) and handle payment state.

---

## 1. Payments Table Structure
The `payments` table acts as a ledger for the `orders` table (1:1 relationship).

| Column | Description |
|--------|-------------|
| `id` | Internal PK. |
| `order_id` | Foreign Key to `orders`. |
| `provider` | `ENUM('RAZORPAY', 'COD', 'WALLET')`. Defines the handler logic. |
| `provider_order_id`| Razorpay's generated order ID (e.g., `order_EKwxw...`). Essential for verifying signatures. |
| `provider_payment_id`| Razorpay's successful payment ID (e.g., `pay_29QQo...`). Essential for processing refunds. |
| `status` | `ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')`. |
| `amount` | The exact amount requested from the provider. |

## 2. The Razorpay Handshake Workflow

1. **Order Creation:** User clicks "Pay". Weebster creates `orders` (PENDING) and `payments` (PENDING).
2. **Provider Initialization:** Backend calls Razorpay API: "Create an order for ₹1000". Razorpay returns `order_EKwxw`. We save this in `provider_order_id`.
3. **Client Interaction:** Frontend opens Razorpay modal using `provider_order_id`.
4. **Webhook / Verification:** Razorpay sends a cryptographically signed payload to our backend webhook.
5. **Database Update:** If signature matches:
   - `UPDATE payments SET status = 'SUCCESS', provider_payment_id = 'pay_29QQo' WHERE provider_order_id = 'order_EKwxw'`
   - `UPDATE orders SET status = 'PROCESSING' WHERE id = ?`

## 3. Failure & Idempotency Rules

### Idempotency
Webhooks can be delivered multiple times by providers. The system must not double-process a payment.
- **Rule:** The webhook handler must check `SELECT status FROM payments WHERE provider_order_id = ?`. If status is already `SUCCESS`, return 200 OK immediately and halt processing.

### Payment Failures
If a user closes the modal or their card declines:
- `payments.status` transitions to `FAILED`.
- The user can attempt payment again.
- **Database Action:** We do NOT update the existing `payments` row. We create a NEW `payments` row for the retry attempt (since Razorpay generates a new `order_id` for the new attempt), preserving the history of the failed attempt.

## 4. Refund Architecture (Future Readiness)
When an admin issues a refund via the dashboard:
1. Backend calls Razorpay Refund API using `provider_payment_id`.
2. On success, `UPDATE payments SET status = 'REFUNDED'`.
3. For Partial Refunds (V2), we will need a separate `refunds` table: `id | payment_id | amount | reason`.
