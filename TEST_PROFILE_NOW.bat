@echo off
title ANANTA - Complete Name Change Test
color 0B

echo.
echo ════════════════════════════════════════════════
echo    ANANTA APP - Complete Profile Test
echo    Changing name to: MJ Rajput
echo ════════════════════════════════════════════════
echo.

REM Check if backend is running
echo [1/3] Checking backend status...
curl -s http://localhost:3000/api/app/profile/AND6926A9B >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend not responding!
    echo.
    echo Please start backend first:
    echo    cd D:\Office\ANANTA-APP\adminpanel\backend
    echo    mvn spring-boot:run
    echo.
    pause
    exit /b 1
)
echo ✓ Backend is running
echo.

REM Run the test
echo [2/3] Running name change test...
cd /d D:\Office\ANANTA-APP\Anantaapp

set MAX_ATTEMPTS=10
set ATTEMPT=1

:RETRY
echo.
echo ─────────────────────────────────────────────────
echo Attempt %ATTEMPT% of %MAX_ATTEMPTS%
echo ─────────────────────────────────────────────────
node test-name-change.mjs

if %ERRORLEVEL% EQU 0 (
    goto SUCCESS
)

if %ATTEMPT% GEQ %MAX_ATTEMPTS% (
    goto FAILED
)

set /a ATTEMPT+=1
echo Waiting 3 seconds before retry...
timeout /t 3 /nobreak >nul
goto RETRY

:SUCCESS
echo.
echo ════════════════════════════════════════════════
echo              ✓✓✓ SUCCESS! ✓✓✓
echo    Name changed to MJ Rajput successfully!
echo ════════════════════════════════════════════════
echo.
echo [3/3] Test completed successfully
pause
exit /b 0

:FAILED
echo.
echo ════════════════════════════════════════════════
echo              ✗✗✗ FAILED ✗✗✗
echo    Could not change name after %MAX_ATTEMPTS% attempts
echo ════════════════════════════════════════════════
echo.
echo Check:
echo  1. Backend is running properly
echo  2. Database is accessible
echo  3. User AND6926A9B exists
echo.
pause
exit /b 1
