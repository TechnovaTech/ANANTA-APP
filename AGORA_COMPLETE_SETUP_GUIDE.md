# 🎥 Complete Agora Live Streaming Setup Guide

## 📋 Step-by-Step Instructions

### Step 1: Create Agora Account & Project

1. **Go to Agora Console**
   - Visit: https://console.agora.io/
   - Click "Sign Up" (top right)
   - Use email or Google/GitHub to register

2. **Verify Email**
   - Check your email inbox
   - Click verification link
   - Complete profile setup

3. **Create New Project**
   - After login, click "Project Management" (left sidebar)
   - Click "Create" button
   - Enter project name: `ananta` (or any name)
   - Choose "Secured mode: APP ID + Token"
   - Click "Submit"

### Step 2: Get Your Credentials

1. **Find Your App ID**
   - In project list, find your project
   - Copy the "App ID" (32-character string)
   - Example: `b6bbf782efa94f8b9894e9b5c1895dfa`

2. **Get App Certificate**
   - Click on your project name
   - Find "Primary Certificate" section
   - Click the eye icon to reveal
   - Copy the certificate (32-character string)
   - Example: `665d7549a187403abbeaacaee0f0a607`

### Step 3: Enable Required Features

1. **Enable Signaling** (Required for live streaming)
   - In your project page, scroll to "ALL FEATURES"
   - Find "Signaling"
   - Toggle it ON (green)

2. **Enable Cloud Recording** (Optional but recommended)
   - Find "Cloud Recording"
   - Toggle it ON

### Step 4: Update Backend Configuration

1. **Open application.properties**
   ```
   File: adminpanel/backend/src/main/resources/application.properties
   ```

2. **Update Agora credentials**
   ```properties
   # Agora Configuration
   agora.appId=YOUR_APP_ID_HERE
   agora.certificate=YOUR_CERTIFICATE_HERE
   ```

3. **Replace with your actual values**
   ```properties
   # Agora Configuration
   agora.appId=b6bbf782efa94f8b9894e9b5c1895dfa
   agora.certificate=665d7549a187403abbeaacaee0f0a607
   ```

### Step 5: Update Frontend Configuration

1. **Open env.ts**
   ```
   File: Anantaapp/config/env.ts
   ```

2. **Update API URL to port 8082**
   ```typescript
   export const ENV = {
     API_BASE_URL: 'http://localhost:8082',
   };
   ```

### Step 6: Start Backend Server

1. **Open terminal in backend folder**
   ```bash
   cd d:\Office\ANANTA-APP\adminpanel\backend
   ```

2. **Start the server**
   ```bash
   mvn spring-boot:run
   ```

3. **Wait for startup message**
   ```
   Started AnantaAdminApplication in X.XXX seconds
   ```

### Step 7: Start Frontend App

1. **Open new terminal in app folder**
   ```bash
   cd d:\Office\ANANTA-APP\Anantaapp
   ```

2. **Start Expo**
   ```bash
   npm start
   ```

3. **Press 'w' for web**

### Step 8: Test Live Streaming

1. **Open browser**: http://localhost:8081
2. **Go to Live tab**
3. **Click "Go Live"**
4. **Allow camera/microphone permissions**
5. **Video should connect successfully!**

## 🔍 Troubleshooting

### Error: "invalid vendor key, can not find appid"

**Cause**: Invalid or inactive Agora App ID

**Solution**:
1. Verify App ID is correct (32 characters)
2. Check project is active in Agora Console
3. Ensure "Signaling" feature is enabled
4. Try creating a new project

### Error: "Connection failed"

**Cause**: Backend not running or wrong port

**Solution**:
1. Check backend is running on port 8082
2. Verify `env.ts` has `http://localhost:8082`
3. Check firewall isn't blocking port 8082

### Error: "Camera in use"

**Cause**: Another app is using camera

**Solution**:
1. Close other video apps (Zoom, Teams, etc.)
2. Refresh browser
3. Allow camera permissions again

### Backend not starting

**Cause**: Port 8082 already in use

**Solution**:
```bash
# Kill process on port 8082
netstat -ano | findstr :8082
taskkill /PID <PID_NUMBER> /F
```

## ✅ Verification Checklist

- [ ] Agora account created
- [ ] Project created with "Secured mode"
- [ ] App ID copied (32 characters)
- [ ] Certificate copied (32 characters)
- [ ] Signaling feature enabled
- [ ] Backend application.properties updated
- [ ] Frontend env.ts updated to port 8082
- [ ] Backend running on port 8082
- [ ] Frontend running on port 8081
- [ ] Camera/mic permissions granted
- [ ] Live streaming works!

## 📱 Testing with Multiple Users

### Host (Broadcaster):
1. Open browser: http://localhost:8081
2. Go to Live tab
3. Click "Go Live"
4. Start streaming

### Viewer:
1. Open incognito/private window: http://localhost:8081
2. Go to Live tab
3. Click on live session card
4. Watch the stream!

## 🎯 Important Notes

1. **Free Tier Limits**:
   - 10,000 minutes/month free
   - After that: $0.99 per 1,000 minutes

2. **Token Expiry**:
   - Tokens expire after 2 hours
   - Backend automatically generates new tokens

3. **Production Deployment**:
   - Change `localhost` to your domain
   - Use HTTPS for production
   - Store credentials in environment variables

## 🔗 Useful Links

- Agora Console: https://console.agora.io/
- Agora Docs: https://docs.agora.io/
- Token Generator: https://webdemo.agora.io/token-builder/
- Pricing: https://www.agora.io/en/pricing/

## 🆘 Still Having Issues?

1. Check browser console (F12) for errors
2. Check backend logs for errors
3. Verify all ports are correct
4. Try creating a completely new Agora project
5. Test with Agora's demo: https://webdemo.agora.io/

---

**Your Current Setup:**
- App ID: `b6bbf782efa94f8b9894e9b5c1895dfa`
- Certificate: `665d7549a187403abbeaacaee0f0a607`
- Backend Port: `8082`
- Frontend Port: `8081`
