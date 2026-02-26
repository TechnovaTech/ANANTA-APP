# Agora Video Streaming Fix

## Issues Fixed

### 1. **Agora Engine Initialization**
- ✅ Fixed deprecated `RtcEngineContext` usage
- ✅ Updated to use modern `initialize({ appId })` API
- ✅ Added proper error logging

### 2. **Channel Profile & Client Role**
- ✅ Fixed channel profile to use `ChannelProfileType.ChannelProfileLiveBroadcasting`
- ✅ Fixed client role to use proper enums:
  - Host: `ClientRoleType.ClientRoleBroadcaster`
  - Viewer: `ClientRoleType.ClientRoleAudience`

### 3. **Event Handlers**
- ✅ Replaced deprecated `addListener` with `registerEventHandler`
- ✅ Fixed event handler signatures to match Agora SDK v4.x
- ✅ Added error event handler for debugging

### 4. **Join Channel**
- ✅ Fixed `joinChannel` parameters to use correct signature
- ✅ Added `clientRoleType` in channel options

### 5. **Camera Controls**
- ✅ Fixed camera toggle to use `switchCamera()` (front/back switch)
- ✅ Removed incorrect enable/disable logic

### 6. **Cleanup**
- ✅ Changed `destroy()` to `release()` for proper cleanup
- ✅ Added error handling in cleanup

### 7. **Permissions**
- ✅ iOS permissions already configured in app.json
- ✅ Android permissions already configured
- ✅ Fixed permission request logic for both platforms

## Configuration

### Backend (Already Configured)
```properties
# application.properties
agora.appId=8d837207d39b49e1a7be1a660c915368
agora.certificate=c307042fd5204f91999011e1a1c5e41f
```

### Mobile App
- Permissions configured in `app.json`
- Agora SDK: `react-native-agora@4.5.3`

## How It Works

### Host Flow:
1. User clicks "Go Live" → Backend generates Agora token with PUBLISHER role
2. App initializes Agora engine with AppId
3. Sets channel profile to Live Broadcasting
4. Sets client role to Broadcaster
5. Starts camera preview
6. Joins channel with token
7. Video streams to all viewers

### Viewer Flow:
1. User joins live session → Backend generates token with SUBSCRIBER role
2. App initializes Agora engine
3. Sets channel profile to Live Broadcasting
4. Sets client role to Audience
5. Joins channel with token
6. Receives host's video stream
7. Displays in RtcSurfaceView

## Testing Steps

### 1. Start Backend
```bash
cd adminpanel/backend
mvn spring-boot:run
```

### 2. Start Mobile App
```bash
cd Anantaapp
npm start
```

### 3. Test Video Live
1. Open app on Device 1 (Host)
2. Go to Live tab
3. Select "Video Live"
4. Click "Go Live"
5. Camera should start streaming

6. Open app on Device 2 (Viewer)
7. Go to Live tab
8. See the live session card
9. Click to join
10. Should see host's video

## Troubleshooting

### Video Not Showing
- Check Agora credentials in `application.properties`
- Verify permissions granted on device
- Check backend logs for token generation
- Enable Agora logs: `engine.setLogLevel(5)`

### "Connecting..." Forever
- Verify backend is running on port 8082
- Check network connectivity
- Verify Agora AppId is valid
- Check token expiration (2 hours)

### Camera Not Working
- Grant camera permissions in device settings
- Restart app after granting permissions
- Check if another app is using camera

### Audio Issues
- Grant microphone permissions
- Check device volume
- Verify `muteLocalAudioStream` is not called

## API Endpoints

### Start Live
```
POST http://localhost:8082/api/app/live/start
Body: { userId, type: "video", title }
Response: { sessionId, channelName, token, appId }
```

### Join Live
```
POST http://localhost:8082/api/app/live/join
Body: { sessionId, userId }
Response: { sessionId, channelName, token, appId, hostUserId, ... }
```

### End Live
```
POST http://localhost:8082/api/app/live/end
Body: { sessionId, userId }
```

### List Live Sessions
```
GET http://localhost:8082/api/app/live/list
Response: { sessions: [...] }
```

## Key Changes Made

### File: `agoraClient.native.ts`
- Updated engine initialization
- Exported `ChannelProfileType` and `ClientRoleType`
- Added error logging

### File: `app/live/video.tsx`
- Fixed imports to include enums
- Updated `initAgora()` with correct API calls
- Fixed event handlers
- Simplified camera toggle
- Updated cleanup method
- Added error logging

## Notes

- Agora tokens expire after 2 hours (configured in backend)
- UID 0 means Agora auto-assigns UID
- Host always uses UID 0 for local stream
- Viewers see host's stream with remote UID
- Web platform shows placeholder (Agora SDK doesn't support web in React Native)

## Success Indicators

✅ Host sees their own video when going live
✅ Viewers see host's video when joining
✅ Audio works both ways
✅ Camera switch button works
✅ Mute button works
✅ Session ends properly
✅ No memory leaks after leaving

## Additional Features Working

- Follow/Unfollow host
- Send gifts during live
- Live comments
- Floating hearts animation
- Viewer count
- Like counter
