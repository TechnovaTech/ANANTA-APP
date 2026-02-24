# Image Loading Fix - Environment Configuration

## Problem
Images were loading from `localhost:8081` (Expo dev server) instead of your VPS API URL.

## Solution
Updated environment configuration to automatically detect development vs production mode.

## Changes Made

### 1. Updated `config/env.ts`
- Auto-detects development mode using `__DEV__` flag
- Development: Uses `http://localhost:8082`
- Production: Uses `https://ecofuelglobal.com`
- Added `getImageUrl()` helper to properly resolve image paths

### 2. Updated Profile Files
- `app/edit-profile.tsx` - Now uses `getImageUrl()` and `getApiUrl()`
- `app/(tabs)/profile.tsx` - Now uses `getImageUrl()` and `getApiUrl()`

## How It Works

**Development Mode (Local):**
```
API: http://localhost:8082
Images: http://localhost:8082/uploads/...
```

**Production Mode (VPS):**
```
API: https://ecofuelglobal.com
Images: https://ecofuelglobal.com/uploads/...
```

## Testing

### Local Development:
```bash
cd Anantaapp
npm start
```
Images will load from localhost.

### Production Build:
```bash
# For Android
npx expo build:android

# For iOS
npx expo build:ios

# For Web
npx expo export:web
```
Images will load from your VPS.

## Manual Override (Optional)

If you need to force production mode in development, edit `config/env.ts`:

```typescript
const isDevelopment = false; // Force production mode
```

## Image URL Resolution

The `getImageUrl()` function handles:
- ✅ Full URLs (http://, https://)
- ✅ Base64 data URLs (data:image/...)
- ✅ Server paths (/uploads/...)
- ✅ Base64 strings (long strings without /)

All image paths are now automatically resolved to the correct URL based on environment.
