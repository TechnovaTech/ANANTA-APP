# 📋 How to Copy Agora Credentials

## Step 1: Copy App ID

1. Look at "App ID" section (shows dots: ●●●●●●●●●●)
2. Find the **copy icon** (📋) on the RIGHT side
3. Click the copy icon
4. Paste somewhere to see the actual App ID

## Step 2: Copy Primary Certificate

1. Look at "Primary Certificate" section (shows dots: ●●●●●●●●●●)
2. Find the **copy icon** (📋) on the RIGHT side
3. Click the copy icon
4. Paste somewhere to see the actual Certificate

## Step 3: Update Backend

Open: `adminpanel/backend/src/main/resources/application.properties`

Replace:
```properties
agora.appId=b6bbf782efa94f8b9894e9b5c1895dfa
agora.certificate=665d7549a187403abbeaacaee0f0a607
```

With your COPIED values:
```properties
agora.appId=PASTE_YOUR_COPIED_APP_ID_HERE
agora.certificate=PASTE_YOUR_COPIED_CERTIFICATE_HERE
```

## Step 4: Test Credentials

Run test:
```bash
cd d:\Office\ANANTA-APP
node test-agora-credentials.js
```

You should see:
```
✅ SUCCESS! Your Agora credentials are VALID!
```

## Step 5: Restart Backend

```bash
cd d:\Office\ANANTA-APP\adminpanel\backend
mvn spring-boot:run
```

## Step 6: Clear Browser Cache & Test

1. Open browser: http://localhost:8081
2. Press: `Ctrl + Shift + R` (hard refresh)
3. Go to Live tab
4. Click "Go Live"
5. Should work now! 🎉

---

**Note**: The dots (●●●●●●●●●●) are just hiding the values for security. The copy icon reveals and copies the actual value.
