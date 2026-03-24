# 🔇 Viewer Mute Host Feature

## ✨ What's New

Viewers can now mute/unmute the host's audio during live sessions (both video and audio). This gives viewers control over their listening experience without affecting other viewers.

## 🎯 Key Features

✅ **Personal Control** - Each viewer can mute/unmute independently
✅ **No Impact on Others** - Muting only affects the viewer's device
✅ **Visual Feedback** - Button shows current mute state
✅ **Easy Toggle** - Single tap to mute/unmute
✅ **Works for Both** - Video and audio live sessions

## 🎨 Visual Design

### Video Live
- **Unmuted**: 🔊 Speaker icon
- **Muted**: 🔇 Muted speaker icon
- Located in action buttons row (between like and gift)

### Audio Live
- **Unmuted**: `volume-high` icon
- **Muted**: `volume-mute` icon with red background
- Located in bottom action row

## 🔧 Technical Implementation

### Video Live (`video.tsx`)

#### 1. State Management
```typescript
const [isHostMuted, setIsHostMuted] = useState(false);
```

#### 2. Toggle Function
```typescript
const toggleHostMute = async () => {
  const engine = engineRef.current;
  if (!engine || role !== 'viewer') return;
  try {
    const nextMuted = !isHostMuted;
    await engine.muteRemoteAudioStream(hostUid, nextMuted);
    setIsHostMuted(nextMuted);
  } catch (e) {
    console.error('Toggle host mute error:', e);
  }
};
```

#### 3. UI Button
```typescript
<TouchableOpacity style={styles.actionButton} onPress={toggleHostMute}>
  <ThemedText style={styles.actionIcon}>
    {isHostMuted ? '🔇' : '🔊'}
  </ThemedText>
</TouchableOpacity>
```

### Audio Live (`audio.tsx`)

#### 1. State Management
```typescript
const [isHostMuted, setIsHostMuted] = useState(false);
```

#### 2. Toggle Function
```typescript
const toggleHostMute = async () => {
  const engine = engineRef.current;
  if (!engine || role !== 'viewer') return;
  try {
    const nextMuted = !isHostMuted;
    await engine.muteRemoteAudioStream(hostUid, nextMuted);
    setIsHostMuted(nextMuted);
  } catch (e) {
    console.error('Toggle host mute error:', e);
  }
};
```

#### 3. UI Button
```typescript
<TouchableOpacity 
  style={[styles.actionButton, isHostMuted && styles.mutedButton]} 
  onPress={toggleHostMute}
>
  <Ionicons 
    name={isHostMuted ? "volume-mute" : "volume-high"} 
    size={20} 
    color="white" 
  />
</TouchableOpacity>
```

## 📱 User Experience

### Before
```
Viewer Actions:
❤️ Like  |  🎁 Gift  |  👥 Viewers
```
No way to mute host audio

### After - Video Live
```
Viewer Actions:
❤️ Like  |  🔊 Mute  |  🎁 Gift  |  👥 Viewers
```

### After - Audio Live
```
Viewer Actions:
💬 Message  |  ❤️ Like  |  🔊 Mute  |  🎁 Gift  |  👥 Viewers
```

## 🎮 How It Works

### For Viewers

1. **Join Live Session**
   - Host audio is unmuted by default
   - 🔊 icon shows audio is playing

2. **Mute Host**
   - Tap the 🔊 button
   - Icon changes to 🔇
   - Host audio stops (only for you)
   - Other viewers still hear the host

3. **Unmute Host**
   - Tap the 🔇 button
   - Icon changes to 🔊
   - Host audio resumes

### Technical Flow

```
Viewer taps mute button
    ↓
toggleHostMute() called
    ↓
Get Agora engine instance
    ↓
Call engine.muteRemoteAudioStream(hostUid, true/false)
    ↓
Update isHostMuted state
    ↓
UI updates to show new state
```

## 🔊 Agora SDK Integration

### Method Used
```typescript
engine.muteRemoteAudioStream(uid, muted)
```

### Parameters
- **uid**: The host's Agora UID (hostUid)
- **muted**: Boolean (true = mute, false = unmute)

### Behavior
- Only affects the local device
- Does not send any signal to other users
- Instant effect (no network delay)
- Persists until changed or session ends

## 🎨 Button States

### Video Live

| State | Icon | Description |
|-------|------|-------------|
| Unmuted | 🔊 | Host audio is playing |
| Muted | 🔇 | Host audio is muted |

### Audio Live

| State | Icon | Background | Description |
|-------|------|------------|-------------|
| Unmuted | volume-high | Normal | Host audio is playing |
| Muted | volume-mute | Red tint | Host audio is muted |

## 📍 Button Placement

### Video Live
```
Bottom Action Bar:
┌─────────────────────────────────────┐
│ [Message Input]  ❤️  🔊  🎁  👥    │
└─────────────────────────────────────┘
```

### Audio Live
```
Bottom Action Bar:
┌─────────────────────────────────────┐
│ [Message Input]  ❤️  🔊  🎁  👥    │
└─────────────────────────────────────┘
```

## 🔒 Security & Permissions

- ✅ Only available to viewers (not hosts)
- ✅ No special permissions required
- ✅ Client-side only (no server calls)
- ✅ Cannot affect other viewers
- ✅ Cannot affect host's actual stream

## 🧪 Testing Scenarios

### Test 1: Basic Mute/Unmute
1. Join live session as viewer
2. Verify host audio is playing
3. Tap mute button (🔊)
4. Verify icon changes to 🔇
5. Verify host audio stops
6. Tap unmute button (🔇)
7. Verify icon changes to 🔊
8. Verify host audio resumes

### Test 2: Multiple Viewers
1. Have 2+ viewers join same session
2. Viewer A mutes host
3. Verify Viewer B still hears host
4. Viewer B mutes host
5. Verify both viewers have muted independently

### Test 3: Session Persistence
1. Mute host audio
2. Send messages in chat
3. Verify mute state persists
4. Send gifts
5. Verify mute state persists

### Test 4: Rejoin Session
1. Mute host audio
2. Leave session
3. Rejoin same session
4. Verify audio is unmuted (default state)

## 🎯 Use Cases

### 1. Noisy Environment
Viewer is in a noisy place and wants to read chat only

### 2. Multiple Tabs
Viewer has multiple live sessions open

### 3. Break Time
Viewer wants to take a break but stay in the session

### 4. Audio Issues
Host has audio problems (echo, feedback, etc.)

### 5. Personal Preference
Viewer prefers to watch without audio

## 🚀 Benefits

✅ **Better UX** - Viewers have control over their experience
✅ **Flexibility** - Can mute temporarily without leaving
✅ **Privacy** - No one knows you muted the host
✅ **Performance** - Reduces audio processing when muted
✅ **Accessibility** - Helps users with audio sensitivities

## 📊 Button Order

### Video Live (Viewer)
1. ❤️ Like
2. 🔊 Mute/Unmute (NEW!)
3. 🎁 Gift
4. 👥 Viewers (if room admin)

### Audio Live (Viewer)
1. 💬 Message Input
2. ❤️ Like
3. 🔊 Mute/Unmute (NEW!)
4. 🎁 Gift
5. 👥 Viewers (if room admin)

## 🎨 Styling Details

### Video Live
```typescript
actionButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(255,255,255,0.2)',
  justifyContent: 'center',
  alignItems: 'center',
}
```

### Audio Live
```typescript
actionButton: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: 'rgba(255,255,255,0.1)',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.2)',
}

mutedButton: {
  backgroundColor: 'rgba(255,68,68,0.2)',
  borderColor: '#ff4444',
}
```

## 🔄 State Management

### Initial State
```typescript
const [isHostMuted, setIsHostMuted] = useState(false);
```
- Default: `false` (unmuted)
- Resets on session join/rejoin

### State Updates
- Toggled by user action only
- Persists during session
- Resets when leaving session

## 🎉 Complete!

Viewers now have full control over the host's audio with a simple, intuitive mute/unmute button! 🚀

## 📝 Notes

- Mute state is local to each viewer
- Does not affect the actual live stream
- Does not notify the host or other viewers
- Resets to unmuted when rejoining
- Works with both video and audio live sessions
