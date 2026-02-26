# 🆕 Create NEW Agora Project (Your current one is broken)

## Problem
Your current Agora project credentials are NOT working (401 Unauthorized).
You need to create a COMPLETELY NEW project.

## Step-by-Step Solution

### 1. Go to Agora Console
- Visit: https://console.agora.io/projects
- Login to your account

### 2. Create NEW Project
- Click **"Create"** button (top right or center)
- Enter project name: `ananta-live` (or any new name)
- **IMPORTANT**: Select **"Secured mode: APP ID + Token"**
- Click **"Submit"**

### 3. Copy NEW Credentials
- Your new project will appear in the list
- Click the **copy icon** (📋) next to App ID
- Paste in Notepad - this is your NEW App ID
- Click the **copy icon** (📋) next to Primary Certificate
- Paste in Notepad - this is your NEW Certificate

### 4. Enable Signaling Feature
- Click on your NEW project name
- Scroll down to "ALL FEATURES"
- Find **"Signaling"**
- Toggle it **ON** (should turn green)
- This is REQUIRED for live streaming!

### 5. Update Backend Configuration

Edit: `d:\Office\ANANTA-APP\adminpanel\backend\src\main\resources\application.properties`

Replace the Agora section with your NEW credentials:
```properties
# Agora
agora.appId=YOUR_NEW_APP_ID_HERE
agora.certificate=YOUR_NEW_CERTIFICATE_HERE
```

### 6. Test NEW Credentials

```bash
cd d:\Office\ANANTA-APP
node test-agora-credentials.js
```

**Expected output:**
```
✅ SUCCESS! Your Agora credentials are VALID!
```

If you still see 401 error, the credentials were copied incorrectly.

### 7. Restart Backend

```bash
cd d:\Office\ANANTA-APP\adminpanel\backend
mvn spring-boot:run
```

Wait for: `Started AnantaAdminApplication`

### 8. Test Live Streaming

1. Open browser: http://localhost:8081
2. Press `Ctrl + Shift + Delete` to clear ALL cache
3. Close and reopen browser
4. Go to: http://localhost:8081
5. Click Live tab
6. Click "Go Live"
7. Allow camera/microphone
8. **Should connect successfully!** 🎉

## Why Your Current Project Failed

Possible reasons:
1. Project was created in wrong mode (Testing mode instead of Secured mode)
2. Project is disabled or suspended
3. Billing issue with Agora account
4. Project was created in different Agora account
5. Certificate was regenerated but you have old one

## Verification Checklist

- [ ] Created NEW project (not using old "ananta" project)
- [ ] Selected "Secured mode: APP ID + Token"
- [ ] Enabled "Signaling" feature
- [ ] Copied NEW App ID (32 characters)
- [ ] Copied NEW Certificate (32 characters)
- [ ] Updated application.properties
- [ ] Test script shows ✅ SUCCESS
- [ ] Backend restarted
- [ ] Browser cache cleared
- [ ] Live streaming works!

## Still Not Working?

If test script STILL shows 401 error after creating NEW project:

1. **Check Agora account status**
   - Go to: https://console.agora.io/
   - Check if account needs verification
   - Check if billing is set up

2. **Try different browser**
   - Some browsers cache Agora Console
   - Try incognito/private mode

3. **Contact Agora Support**
   - Your account might need activation
   - Visit: https://www.agora.io/en/support/

## Important Notes

- FREE tier: 10,000 minutes/month
- No credit card required for free tier
- Signaling feature MUST be enabled
- Use "Secured mode" not "Testing mode"
