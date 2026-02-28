# 💳 Razorpay Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    RAZORPAY PAYMENT FLOW                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   USER       │
│ (Web App)    │
└──────┬───────┘
       │
       │ 1. Selects Plan (e.g., Silver - ₹100)
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  http://localhost:8081/recharge                              │
│  - Shows plans: Basic, Silver, Gold, Platinum, Diamond      │
│  - User clicks "Proceed to Payment"                         │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 2. POST /api/app/wallet/razorpay/create-order
       │    { userId, planId }
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  BACKEND (Java Spring Boot)                                  │
│  - Creates Razorpay order                                    │
│  - Amount: ₹100 * 100 = 10000 paise                         │
│  - Returns: orderId, amount, currency, key                   │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 3. Returns order details
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND (React Native Web)                                 │
│  - Opens Razorpay checkout popup                            │
│  - Shows payment form                                        │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 4. User enters card details
       │    Card: 4111 1111 1111 1111
       │    CVV: 123, Expiry: 12/25
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  RAZORPAY SERVER                                             │
│  - Processes payment                                         │
│  - Returns: payment_id, order_id, signature                 │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 5. Payment success callback
       │    { razorpay_payment_id, razorpay_order_id, 
       │      razorpay_signature }
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND                                                     │
│  - Receives payment response                                 │
│  - Calls verify endpoint                                     │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 6. POST /api/app/wallet/razorpay/verify-payment
       │    { razorpay_payment_id, razorpay_order_id,
       │      razorpay_signature, userId, planId }
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  BACKEND                                                      │
│  - Verifies signature using Razorpay SDK                    │
│  - If valid:                                                 │
│    ✅ Add 250 coins to user wallet                          │
│    ✅ Create wallet transaction (RECHARGE)                  │
│    ✅ Create recharge record (APPROVED)                     │
│  - Returns: { success: true, balance, coinsAdded }          │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 7. Returns success response
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND                                                     │
│  - Shows success screen                                      │
│  - "Payment Successful!"                                     │
│  - "250 coins added to your wallet"                         │
│  - Button: "Back to Wallet"                                 │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 8. User clicks "Back to Wallet"
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  WALLET SCREEN                                               │
│  - Shows updated balance                                     │
│  - Shows transaction history                                 │
└──────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════
                        KEY ENDPOINTS
═══════════════════════════════════════════════════════════════

1. Create Order:
   POST http://localhost:8080/api/app/wallet/razorpay/create-order
   Body: { "userId": "user123", "planId": 2 }
   Response: { "orderId": "order_xxx", "amount": 10000, ... }

2. Verify Payment:
   POST http://localhost:8080/api/app/wallet/razorpay/verify-payment
   Body: { 
     "razorpay_payment_id": "pay_xxx",
     "razorpay_order_id": "order_xxx",
     "razorpay_signature": "signature_xxx",
     "userId": "user123",
     "planId": 2
   }
   Response: { "success": true, "balance": 250, "coinsAdded": 250 }


═══════════════════════════════════════════════════════════════
                        DATABASE CHANGES
═══════════════════════════════════════════════════════════════

After successful payment:

1. WALLET table:
   - balance += coins (e.g., 0 + 250 = 250)

2. WALLET_TRANSACTION table:
   - New record: type=RECHARGE, amount=250, credit=true

3. DAILY_RECHARGE table:
   - New record: status=APPROVED, amount=100, coins=250


═══════════════════════════════════════════════════════════════
                        SECURITY
═══════════════════════════════════════════════════════════════

✅ Payment signature verified on backend
✅ Coins only credited after verification
✅ Transaction recorded for audit
✅ Test mode credentials (safe for development)


═══════════════════════════════════════════════════════════════
                        TEST CARDS
═══════════════════════════════════════════════════════════════

Success:
  4111 1111 1111 1111 (Visa)
  5555 5555 5555 4444 (Mastercard)

Failure:
  4000 0000 0000 0002 (Declined)

CVV: Any 3 digits
Expiry: Any future date
```
