# 🚀 Quick Start - Razorpay Integration

## What Changed?

### Backend (3 changes)
1. **pom.xml** - Added Razorpay dependency
2. **AppWalletController.java** - Added 2 new endpoints:
   - `POST /api/app/wallet/razorpay/create-order`
   - `POST /api/app/wallet/razorpay/verify-payment`

### Frontend (1 change)
1. **recharge.tsx** - Integrated Razorpay checkout

## How to Test?

### Step 1: Rebuild Backend
```bash
cd d:\Office\ANANTA-APP\adminpanel\backend
mvn clean install
mvn spring-boot:run
```

### Step 2: Start Frontend
```bash
cd d:\Office\ANANTA-APP\Anantaapp
npm start
# Press 'w' for web
```

### Step 3: Test Payment
1. Go to http://localhost:8081/recharge
2. Select any plan (e.g., Silver - ₹100)
3. Click "Proceed to Payment"
4. Razorpay popup will open
5. Use test card: **4111 1111 1111 1111**
6. CVV: **123**, Expiry: **12/25**
7. Click Pay
8. Coins will be added automatically!

## Test Cards

| Card Number | Type | Result |
|-------------|------|--------|
| 4111 1111 1111 1111 | Visa | Success |
| 5555 5555 5555 4444 | Mastercard | Success |
| 4000 0000 0000 0002 | Visa | Declined |

## What Happens?

1. ✅ User selects plan
2. ✅ Backend creates Razorpay order
3. ✅ Razorpay checkout opens
4. ✅ User pays
5. ✅ Backend verifies payment
6. ✅ **Coins added to wallet instantly**
7. ✅ Transaction recorded
8. ✅ Success screen shown

## Check Results

### In Admin Panel
- Go to http://localhost:3000/recharges
- See approved recharge with coins

### In App
- Check wallet balance
- See transaction history

**That's it! Payment integration is complete! 🎉**
