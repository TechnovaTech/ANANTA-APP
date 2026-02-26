# 🎥 Quick Start - Test Video Live Streaming

## ✅ What Was Fixed

1. **Agora SDK Integration** - Updated to use correct Agora v4.x API
2. **Video Streaming** - Host can now broadcast video properly
3. **Viewer Experience** - Viewers can see host's live video
4. **Camera Controls** - Camera switch and mute buttons work
5. **API Configuration** - Backend URL corrected to port 8082

## 🚀 Quick Test (5 Minutes)

### Step 1: Start Backend
```bash
cd adminpanel/backend
mvn spring-boot:run
```
Wait for: `Started AnantaAdminBackendApplication`

### Step 2: Start Mobile App
```bash
cd Anantaapp
npm start
```
Choose: `a` for Android or `i` for iOS

### Step 3: Test as Host
1. Open app on your device/emulator
2. Tap **Live** tab (bottom navigation)
3. Select **Video Live** (should be selected by default)
4. Tap **Go Live** button
5. ✅ Grant camera and microphone permissions
6. ✅ You should see your camera feed

### Step 4: Test as Viewer (Optional - Need 2 Devices)
1. Open app on second device
2. Go to **Live** tab
3. You'll see the live session card
4. Tap the card to join
5. ✅ You should see the host's video

## 🎮 Controls

### Host Controls (Bottom Right):
- 🎤 **Microphone** - Mute/unmute audio
- 📷 **Camera** - Switch front/back camera
- ⏹ **Stop** - End live session

### Viewer Controls (Bottom Right):
- ❤️ **Like** - Send like with floating heart
- 🎁 **Gift** - Send virtual gifts to host

## 📱 Permissions Required

### Android
- Camera
- Microphone

### iOS
- Camera
- Microphone

**Note:** If permissions denied, go to device Settings → Apps → Ananta → Permissions

## 🔧 Configuration

### Backend (Already Set)
- **Port:** 8082
- **Agora AppId:** 8d837207d39b49e1a7be1a660c915368
- **Agora Certificate:** c307042fd5204f91999011e1a1c5e41f

### Mobile App (Already Set)
- **API URL:** http://localhost:8082
- **Agora SDK:** react-native-agora@4.5.3

## ❗ Common Issues

### Issue: "Connecting..." forever
**Solution:** 
- Make sure backend is running on port 8082
- Check: `http://localhost:8082/api/app/live/list` in browser

### Issue: Black screen after "Go Live"
**Solution:**
- Grant camera permissions
- Restart the app
- Check if another app is using camera

### Issue: Can't see host's video as viewer
**Solution:**
- Make sure host is still live
- Check network connection
- Try rejoining the session

### Issue: "Live video works only in mobile app"
**Solution:**
- This is expected on web browser
- Use Android/iOS device or emulator

## 🎯 Expected Behavior

### ✅ Working Features:
- [x] Host can start video live
- [x] Host's camera feed displays
- [x] Viewers can join and see host
- [x] Camera switch works
- [x] Mute/unmute works
- [x] Live session ends properly
- [x] Follow/unfollow host
- [x] Send gifts
- [x] Live comments
- [x] Floating hearts

### 📊 Live Session Info:
- Viewer count (top left)
- Like count (top left)
- Host profile (top left)
- Live badge (red "LIVE")

## 🔍 Debugging

### Check Backend Logs
```bash
# In backend terminal, look for:
"Building RTC token for channel: live_..."
"Live session started: ..."
```

### Check Mobile Logs
```bash
# In Expo terminal, look for:
"Agora engine creation failed" - BAD
"Agora init error" - BAD
No errors - GOOD
```

### Test Backend API
```bash
# Test if backend is responding
curl http://localhost:8082/api/app/live/list
```

## 📞 Support

If issues persist:
1. Check `AGORA_VIDEO_STREAMING_FIX.md` for detailed troubleshooting
2. Verify Agora credentials are valid
3. Check device permissions
4. Restart both backend and mobile app

## 🎉 Success!

When working correctly:
- Host sees their own video immediately after "Go Live"
- Viewers see host's video when joining
- Controls respond instantly
- No lag or freezing
- Clean exit when ending session

**Enjoy your live streaming! 🚀**
