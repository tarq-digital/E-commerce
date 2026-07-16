# State Diagrams - Weebster

This document illustrates the lifecycle of core entities within the platform to ensure the IA properly accounts for all possible edge cases.

---

## 1. Order Lifecycle State Diagram

The Order is the most complex state machine in the system.

```mermaid
stateDiagram-v2
    [*] --> PENDING: User clicks "Checkout" (Pre-Payment)
    
    PENDING --> PROCESSING: Payment Successful (Razorpay Webhook)
    PENDING --> CANCELLED: Payment Failed / Abandoned / Timeout
    
    PROCESSING --> SHIPPED: Admin updates status + Tracking info
    PROCESSING --> REFUNDED: Admin cancels before shipping
    
    SHIPPED --> DELIVERED: Admin updates status (Final)
    SHIPPED --> RETURNED: Customer returns item post-delivery
    
    CANCELLED --> [*]
    REFUNDED --> [*]
    DELIVERED --> [*]
    RETURNED --> [*]
```
*Architecture Rule:* Customers can only cancel an order while it is in the `PENDING` or `PROCESSING` state. Once `SHIPPED`, they must initiate a Return flow.

## 2. Product Lifecycle State Diagram

How a product moves from creation to the storefront.

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Admin creates product, missing details
    
    DRAFT --> ACTIVE: Admin publishes product (Stock > 0)
    
    ACTIVE --> OUT_OF_STOCK: Stock hits 0 (Automatic)
    OUT_OF_STOCK --> ACTIVE: Admin adds inventory
    
    ACTIVE --> ARCHIVED: Admin manually hides product
    OUT_OF_STOCK --> ARCHIVED: Product discontinued
    
    ARCHIVED --> ACTIVE: Admin un-archives
    
    ARCHIVED --> [*]: Deleted from DB (Not recommended)
```
*Architecture Rule:* Never hard-delete products if they have associated orders, as it will break historical order receipts. Use the `ARCHIVED` state to hide them from the public storefront while retaining database integrity.

## 3. Cart Lifecycle State Diagram

```mermaid
stateDiagram-v2
    [*] --> EMPTY: Initial Visit
    
    EMPTY --> ACTIVE: User adds first item
    
    ACTIVE --> ACTIVE: User adds/removes items
    
    ACTIVE --> CHECKOUT_SESSION: User proceeds to payment
    
    CHECKOUT_SESSION --> ACTIVE: Payment failed / User goes back
    
    CHECKOUT_SESSION --> CONVERTED: Payment Success
    
    CONVERTED --> [*]
    
    ACTIVE --> ABANDONED: Session expires (30 days)
```
*Architecture Rule:* The cart data must gracefully transition from `localStorage` to the database when a Guest user registers or logs in, merging the anonymous cart with their authenticated cart.
