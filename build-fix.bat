@echo off
echo ========================================
echo ANANTA APP - BUILD FIX SCRIPT
echo ========================================
echo.
echo This script will fix the build issues after adding keep-awake functionality
echo.

cd /d "d:\New folder\ANANTA-APP\Anantaapp"

echo Step 1: Cleaning node modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Step 2: Cleaning Expo cache...
npx expo install --fix

echo Step 3: Installing dependencies...
npm install

echo Step 4: Cleaning Android build cache...
cd android
if exist .gradle rmdir /s /q .gradle
if exist app\build rmdir /s /q app\build
cd ..

echo Step 5: Prebuild for native changes...
npx expo prebuild --clean

echo Step 6: Verifying keep-awake installation...
npm list expo-keep-awake

echo.
echo ========================================
echo BUILD FIX COMPLETE!
echo ========================================
echo.
echo Changes made:
echo - Added expo-keep-awake@13.0.2 dependency
echo - Added WAKE_LOCK permission to Android
echo - Added expo-keep-awake plugin to app.json
echo - Fixed useKeepAwake hook implementation
echo - Cleaned build caches
echo.
echo You can now try building again with:
echo eas build --platform android --profile preview
echo.
pause