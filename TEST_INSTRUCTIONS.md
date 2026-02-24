# 🧪 Profile Name Change Test

## Quick Test - Change Name to "MJ Rajput"

### Option 1: Simple Test (Recommended)
**Double-click:** `TEST_PROFILE_NOW.bat`

This will:
- ✅ Check if backend is running
- ✅ Try to change name to "MJ Rajput"
- ✅ Retry automatically up to 10 times
- ✅ Show clear SUCCESS or FAILED message

### Option 2: Keep Retrying Forever
**Double-click:** `RUN_NAME_TEST.bat`

This will keep trying every 3 seconds until it works.

---

## What It Does

The test script will:
1. Send update request with name "MJ Rajput"
2. Fetch the profile to verify
3. Check if name actually changed
4. Show ✅ SUCCESS if it worked
5. Retry if it failed

---

## Expected Output

### ✅ When Working:
```
🔄 Attempting to change name to: MJ Rajput
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 Update Status: 200
📥 Current Name: MJ Rajput
📥 Full Name: MJ Rajput
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SUCCESS! Name changed to MJ Rajput
```

### ❌ When Not Working:
```
📤 Update Status: 500
❌ FAILED - Backend returned error
⏳ Retrying in 3 seconds...
```

---

## Before Running

Make sure backend is running:
```bash
cd D:\Office\ANANTA-APP\adminpanel\backend
mvn spring-boot:run
```

Wait for: "Started AnantaAdminApplication"

---

## Files Created

1. **TEST_PROFILE_NOW.bat** - Complete test with backend check (USE THIS)
2. **RUN_NAME_TEST.bat** - Simple retry loop
3. **test-name-change.mjs** - Enhanced test script with better output

---

## Troubleshooting

If test keeps failing:
1. Check backend is running: http://localhost:3000
2. Check user exists: AND6926A9B
3. Look at backend logs for errors
4. Try restarting backend

---

**Just double-click `TEST_PROFILE_NOW.bat` and watch it work!** 🚀
