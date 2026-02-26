# 🎥 Agora Live Streaming Setup Instructions

## ⚠️ CRITICAL: Your current Agora App ID is INVALID

The error "invalid vendor key, can not find appid" means your Agora App ID is not recognized by Agora's servers.

## 📋 Steps to Fix:

### 1. Create Agora Account & Project

1. Go to **Agora Console**: https://console.agora.io/
2. Sign up or log in
3. Click **"Create Project"** or select an existing project
4. Choose **"Secured mode: APP ID + Token"** (recommended)

### 2. Get Your Credentials

From your Agora project dashboard, copy:
- **App ID** (32-character string)
- **App Certificate** (32-character string)

### 3. Update Backend Configuration

Open: `adminpanel/backend/src/main/resources/application.properties`

Replace these lines:
```properties
agora.appId=YOUR_AGORA_APP_ID_HERE
agora.certificate=YOUR_AGORA_APP_CERTIFICATE_HERE
```

With your actual credentials:
```properties
agora.appId=YOUR_ACTUAL_APP_ID_FROM_AGORA_CONSOLE
agora.certificate=YOUR_ACTUAL_CERTIFICATE_FROM_AGORA_CONSOLE
```

### 4. Restart Backend Server

```bash
cd adminpanel/backend
mvn spring-boot:run
```

### 5. Test Live Streaming

1. Open the mobile app
2. Go to Live tab
3. Click "Go Live"
4. The video should now connect successfully!

## 🔍 Verification

After updating, you should see in the console:
```
Stored appId: YOUR_NEW_APP_ID
```

And the connection should succeed without the "invalid vendor key" error.

## 📚 Additional Resources

- Agora Documentation: https://docs.agora.io/
- Token Generator: https://webdemo.agora.io/token-builder/
- Agora Support: https://www.agora.io/en/support/

## ⚡ Quick Test

You can test if your App ID is valid by visiting:
https://webdemo.agora.io/agora-web-showcase/examples/Agora-Web-Tutorial-1to1-Web/

Enter your App ID there to verify it works.
