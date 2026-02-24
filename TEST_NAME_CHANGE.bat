@echo off
echo ========================================
echo Testing Profile Name Change to MJ Rajput
echo ========================================
echo.

cd /d D:\Office\ANANTA-APP\Anantaapp

:RETRY
echo [%TIME%] Running test...
node test-profile-update.mjs

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Check if name changed to MJ Rajput
    echo ========================================
    pause
    exit /b 0
) else (
    echo.
    echo [FAILED] Retrying in 5 seconds...
    timeout /t 5 /nobreak >nul
    goto RETRY
)
