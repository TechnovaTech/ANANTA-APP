@echo off
echo ========================================
echo QUICK FIX: Restart Backend and Test
echo ========================================
echo.

echo Killing existing Java processes...
taskkill /F /IM java.exe 2>nul
timeout /t 3 >nul

echo.
echo Starting backend in new window...
cd adminpanel\backend
start "ANANTA Backend - Watch for errors" cmd /k "mvn spring-boot:run"

echo.
echo Waiting 30 seconds for backend to start...
echo (Watch the other window for startup completion)
timeout /t 30 >nul

echo.
echo Running test to change name to MJ Rajput...
cd ..\..
cd Anantaapp
node test-profile-update.mjs

echo.
pause
