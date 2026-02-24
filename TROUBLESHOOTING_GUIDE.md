# PROFILE EDIT 500 ERROR - COMPLETE FIX

## Quick Fix Steps

### 1. Test Backend Connection
```bash
TEST_BACKEND.bat
```
Should show: `"status":"OK"`

If NOT working → Backend is down, go to Step 2
If working → Go to Step 3

### 2. Start Backend
```bash
START_BACKEND.bat
```

Wait for: `Started AnantaAdminApplication`

Then run `TEST_BACKEND.bat` again

### 3. Check Backend Logs
When you edit profile, watch the backend console for:
```
=== Profile Update Request ===
UserId: AN12345678
Username: yourname
```

If you see errors, note the exact error message.

### 4. Common Errors & Fixes

#### Error: "User not found"
**Fix**: User doesn't exist in database
```bash
# Check database
psql -U postgres -d ananta_db
SELECT user_id, username FROM users;
```

#### Error: "Connection refused"
**Fix**: Backend not running
```bash
START_BACKEND.bat
```

#### Error: "Database connection failed"
**Fix**: PostgreSQL not running
- Start PostgreSQL service
- Check credentials in `application.properties`

#### Error: Image upload fails
**Fix**: Create uploads directory
```bash
mkdir adminpanel\public\uploads
```

## What Was Fixed

### 1. User Model
Changed from `@Lob` to `TEXT` column for profile images to handle large base64 strings better.

### 2. Profile Update Endpoint
- Added comprehensive error logging
- Better exception handling
- Smarter image handling (only save new images)
- Returns proper error messages

### 3. Global Exception Handler
Catches ALL errors and logs them with full stack traces.

### 4. Health Check Endpoint
Test backend: `http://localhost:8082/api/app/health`

## Architecture Flow

```
Mobile App (edit-profile.tsx)
    ↓ POST /api/app/profile
    ↓ {userId, username, fullName, bio, ...}
    ↓
Next.js (localhost:3000)
    ↓ Proxy via next.config.js
    ↓
Java Backend (localhost:8082)
    ↓ AppUserController.updateProfile()
    ↓ Find user by userId
    ↓ Update user fields
    ↓ Save to database
    ↓
PostgreSQL (ananta_db)
```

## Debugging Commands

### Check if backend is running
```bash
netstat -ano | findstr :8082
```

### Check backend logs
Look for these lines in backend console:
```
=== Profile Update Request ===
UserId: ...
Found user: ...
=== Profile Updated Successfully ===
```

### Check database
```sql
-- Connect to database
psql -U postgres -d ananta_db

-- Check users
SELECT user_id, username, full_name FROM users;

-- Check specific user
SELECT * FROM users WHERE user_id = 'AN12345678';
```

### Test API directly
```bash
# Test health
curl http://localhost:8082/api/app/health

# Test profile update
curl -X POST http://localhost:8082/api/app/profile ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"AN12345678\",\"username\":\"test\",\"fullName\":\"Test User\"}"
```

## Files Modified

1. `AppUserController.java` - Enhanced error handling
2. `User.java` - Changed profileImage column type
3. `GlobalExceptionHandler.java` - NEW - Catches all errors
4. `TEST_BACKEND.bat` - NEW - Test connectivity
5. `START_BACKEND.bat` - NEW - Start backend easily

## Still Not Working?

### Step 1: Check Backend Console
Look for the EXACT error message when you click Save Profile.

### Step 2: Check Browser Console
Open DevTools → Network tab → Click the failed request → Check:
- Request payload (what was sent)
- Response (error message)

### Step 3: Verify Database
```sql
-- Check if user exists
SELECT * FROM users WHERE user_id = 'YOUR_USER_ID';

-- Check table structure
\d users
```

### Step 4: Check Logs Location
Backend logs are in the console where you ran `START_BACKEND.bat`

### Step 5: Restart Everything
```bash
# Stop all services
# Then start in order:

# 1. PostgreSQL (if not running as service)

# 2. Backend
START_BACKEND.bat

# 3. Admin Panel (optional)
START_ADMIN_PANEL.bat

# 4. Mobile App
cd Anantaapp
npm start
```

## Success Indicators

✅ `TEST_BACKEND.bat` shows "status":"OK"
✅ Backend console shows "Profile Updated Successfully"
✅ Mobile app shows success message
✅ Profile changes are visible immediately

## Need More Help?

1. Run `TEST_BACKEND.bat` and share output
2. Share backend console logs (the error section)
3. Share browser console error (Network tab)
4. Share your userId from the app

---
**Last Updated**: 2024
**Status**: Enhanced with comprehensive error handling
