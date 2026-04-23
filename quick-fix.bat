@echo off
echo ========================================
echo ANANTA APP - QUICK BUILD FIX
echo ========================================
echo.
echo Removing expo-keep-awake dependency to fix build issues
echo Using alternative implementation instead
echo.

cd /d "d:\New folder\ANANTA-APP\Anantaapp"

echo Step 1: Removing expo-keep-awake...
npm uninstall expo-keep-awake

echo Step 2: Cleaning build cache...
if exist android\.gradle rmdir /s /q android\.gradle
if exist android\app\build rmdir /s /q android\app\build

echo Step 3: Running prebuild...
npx expo prebuild --clean

echo.
echo ========================================
echo QUICK FIX COMPLETE!
echo ========================================
echo.
echo The app now uses a simpler keep-awake implementation
echo that doesn't require additional native dependencies.
echo.
echo You can now try building again with:
echo eas build --platform android --profile preview
echo.
pause