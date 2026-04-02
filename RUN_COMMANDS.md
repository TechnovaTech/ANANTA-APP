# 📝 Exact Commands to Run

## Terminal 1 - Backend

```bash
cd d:\Office\ANANTA-APP\adminpanel\backend
mvn clean install
mvn spring-boot:run
```

Wait for: `Started AdminBackendApplication`

## Terminal 2 - Frontend

```bash
cd d:\Office\ANANTA-APP\Anantaapp
npm start
```

Press: `w` (for web)

Browser will open: http://localhost:8081

## Test the Payment

1. **Login** (if not logged in)
2. **Go to Wallet** (bottom navigation)
3. **Click "Recharge"** button
4. **Select a plan** (e.g., Silver - ₹100 for 250 coins)
5. **Click "Proceed to Payment"**
6. **Razorpay popup opens**
7. **Enter test card:**
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: `12/25`
   - Name: `Test User`
8. **Click "Pay Now"**
9. **Success!** Coins added to wallet

## Verify

### Check Wallet Balance
- Should show increased coins

### Check Admin Panel
```
http://localhost:3011/recharges
```
- Should show new approved recharge

### Check Backend Logs
- Should show: "Payment verified successfully"

## Files Modified

1. `adminpanel/backend/pom.xml` - Added Razorpay dependency
2. `adminpanel/backend/src/main/java/com/ananta/admin/controller/AppWalletController.java` - Added payment endpoints
3. `Anantaapp/app/recharge.tsx` - Integrated Razorpay

## Credentials Used

```
Razorpay Key: rzp_test_RlUAkt1HzIvV4j
Razorpay Secret: sJTXltlLKxoz1f0tjwf8hdTM
```

## Done! ✅

Your Razorpay integration is complete and ready to test!
