@echo off
echo Installing expo-keep-awake dependency...
cd /d "d:\New folder\ANANTA-APP\Anantaapp"
npm install expo-keep-awake
echo.
echo Keep-awake dependency installed successfully!
echo.
echo The app now includes:
echo - Device wake lock during live streaming
echo - Prevents screen sleep for both hosts and viewers
echo - Automatic activation when joining live sessions
echo - Automatic deactivation when leaving sessions
echo.
pause