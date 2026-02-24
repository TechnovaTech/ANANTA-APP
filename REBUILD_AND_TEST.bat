@echo off
echo ========================================
echo REBUILDING BACKEND AND TESTING
echo ========================================
echo.

echo Step 1: Stopping any running backend...
taskkill /F /IM java.exe 2>nul
timeout /t 2 >nul

echo.
echo Step 2: Rebuilding backend...
cd adminpanel\backend
call mvn clean compile -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Starting backend...
start "ANANTA Backend" cmd /k "mvn spring-boot:run"

echo.
echo Waiting for backend to start (30 seconds)...
timeout /t 30 >nul

echo.
echo Step 4: Running profile update test...
cd ..\..
cd Anantaapp
node test-profile-update.mjs

echo.
echo ========================================
echo TEST COMPLETE!
echo Check if name changed to MJ Rajput
echo ========================================
pause
