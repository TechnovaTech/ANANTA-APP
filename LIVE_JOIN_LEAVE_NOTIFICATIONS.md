# 🎉 Live Stream Join/Leave Notifications Feature

## ✨ What's New

When viewers join or leave a live video/audio session, all participants will now see system messages like:
- **"@username joined"** - when someone enters the live stream
- **"@username left"** - when someone exits the live stream

## 🎨 Visual Design

### System Messages Styling
- **Video Live**: Gold text (#FFD700) on semi-transparent background
- **Audio Live**: Gold text with golden border on semi-transparent background
- Messages are centered and visually distinct from regular chat messages

## 🔧 Technical Implementation

### Backend Changes (`AppLiveController.java`)

#### 1. Join Notification
When a viewer joins via `/api/app/live/join`:
```java
// Broadcast join message
Optional<User> viewerOpt = userRepository.findByUserId(userId);
String viewerUsername = viewerOpt.map(User::getUsername).orElse(userId);
Map<String, Object> joinMsg = new HashMap<>();
joinMsg.put("id", System.currentTimeMillis());
joinMsg.put("user", "System");
joinMsg.put("message", "@" + viewerUsername + " joined");
joinMsg.put("avatar", "system");
joinMsg.put("timestamp", LocalDateTime.now());
joinMsg.put("isSystemMessage", true);
sessionMessages.computeIfAbsent(sessionId, k -> new ArrayList<>()).add(joinMsg);
```

#### 2. Leave Notification
When a viewer leaves via `/api/app/live/leave`:
```java
// Broadcast leave message
Optional<User> viewerOpt = userRepository.findByUserId(leavingUserId);
String viewerUsername = viewerOpt.map(User::getUsername).orElse(leavingUserId);
Map<String, Object> leaveMsg = new HashMap<>();
leaveMsg.put("id", System.currentTimeMillis());
leaveMsg.put("user", "System");
leaveMsg.put("message", "@" + viewerUsername + " left");
leaveMsg.put("avatar", "system");
leaveMsg.put("timestamp", LocalDateTime.now());
leaveMsg.put("isSystemMessage", true);
sessionMessages.computeIfAbsent(sessionId, k -> new ArrayList<>()).add(leaveMsg);
```

### Frontend Changes

#### Video Live (`video.tsx`)
1. **Pass userId when leaving**:
   ```typescript
   body: JSON.stringify({ sessionId, userId })
   ```

2. **Render system messages differently**:
   ```typescript
   {liveComments.map((comment) => {
     const isSystemMsg = comment.isSystemMessage === true;
     return (
       <View key={comment.id} style={isSystemMsg ? styles.systemMessageItem : styles.liveCommentItem}>
         {!isSystemMsg && <Image source={{ uri: comment.avatar }} style={styles.liveCommentAvatar} />}
         <View style={isSystemMsg ? styles.systemMessageContent : styles.liveCommentContent}>
           {isSystemMsg ? (
             <Text style={styles.systemMessageText}>{comment.message}</Text>
           ) : (
             <>
               <Text style={styles.liveCommentUser}>@{comment.user}</Text>
               <Text style={styles.liveCommentText}>{comment.message}</Text>
             </>
           )}
         </View>
       </View>
     );
   })}
   ```

3. **System message styles**:
   ```typescript
   systemMessageItem: {
     flexDirection: 'row',
     marginBottom: 8,
     alignItems: 'center',
     justifyContent: 'center',
   },
   systemMessageContent: {
     backgroundColor: 'rgba(255,255,255,0.15)',
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 12,
   },
   systemMessageText: {
     color: '#FFD700',
     fontSize: 12,
     fontWeight: '600',
     textAlign: 'center',
   }
   ```

#### Audio Live (`audio.tsx`)
Same implementation as video live with slightly different styling to match the audio UI theme.

## 🎯 Features

✅ **Real-time notifications** - All viewers see join/leave messages instantly
✅ **Username display** - Shows actual username (e.g., "@john_doe joined")
✅ **Fallback to userId** - If username not available, shows userId
✅ **Visual distinction** - System messages have unique golden styling
✅ **Centered layout** - System messages are centered for better visibility
✅ **Works for both** - Video and audio live sessions

## 🚀 How It Works

1. **Viewer Joins**:
   - Frontend calls `/api/app/live/join` with userId
   - Backend adds viewer to session
   - Backend creates system message: "@username joined"
   - Message is stored in sessionMessages
   - All clients polling `/api/app/live/messages/{sessionId}` receive it

2. **Viewer Leaves**:
   - Frontend calls `/api/app/live/leave` with userId
   - Backend removes viewer from session
   - Backend creates system message: "@username left"
   - Message is stored in sessionMessages
   - All clients receive the leave notification

3. **Message Display**:
   - Frontend checks `isSystemMessage` flag
   - System messages rendered with special styling
   - Regular messages rendered normally

## 📱 User Experience

### Before
- Viewers joined/left silently
- No indication of audience changes
- Host couldn't see who's joining

### After
- Clear notifications when viewers join/leave
- Better engagement awareness
- Host can welcome new viewers
- Community feels more connected

## 🔄 Message Flow

```
Viewer Joins
    ↓
Frontend: /api/app/live/join
    ↓
Backend: Add to sessionViewers
    ↓
Backend: Create join message
    ↓
Backend: Add to sessionMessages
    ↓
All Clients: Poll /api/app/live/messages
    ↓
Frontend: Render with gold styling
```

## 🎨 Styling Details

### Video Live
- Background: `rgba(255,255,255,0.15)`
- Text Color: `#FFD700` (Gold)
- Font Weight: `600` (Semi-bold)
- Border Radius: `12px`

### Audio Live
- Background: `rgba(255,215,0,0.2)`
- Border: `1px solid rgba(255,215,0,0.4)`
- Text Color: `#FFD700` (Gold)
- Font Weight: `600` (Semi-bold)
- Border Radius: `16px`

## 🧪 Testing

To test the feature:

1. **Start Backend**:
   ```bash
   cd adminpanel/backend
   mvn spring-boot:run
   ```

2. **Start Mobile App**:
   ```bash
   cd Anantaapp
   npm start
   ```

3. **Test Scenario**:
   - User A starts a live session (video or audio)
   - User B joins the session → See "@UserB joined"
   - User C joins the session → See "@UserC joined"
   - User B leaves → See "@UserB left"
   - User C leaves → See "@UserC left"

## 📝 Notes

- System messages are stored in memory (ConcurrentHashMap)
- Messages are limited to last 50 per session
- Join/leave messages don't count toward message limits
- Works seamlessly with existing chat functionality
- No database changes required

## 🎉 Complete!

The join/leave notification feature is now fully implemented and ready to use! 🚀
