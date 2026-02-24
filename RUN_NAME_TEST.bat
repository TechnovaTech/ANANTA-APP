@echo off
title Testing Name Change - MJ Rajput
color 0A

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   ANANTA APP - Profile Name Change Test       ║
echo ║   Target: MJ Rajput                            ║
echo ╚════════════════════════════════════════════════╝
echo.

cd /d D:\Office\ANANTA-APP\Anantaapp

set ATTEMPT=1

:RETRY
echo [Attempt #%ATTEMPT%] Testing at %TIME%...
echo.

node test-name-change.mjs

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ╔════════════════════════════════════════════════╗
    echo ║              ✓ TEST PASSED!                    ║
    echo ║   Name successfully changed to MJ Rajput       ║
    echo ╚════════════════════════════════════════════════╝
    echo.
    pause
    exit /b 0
)

set /a ATTEMPT+=1
echo.
echo ⏳ Retrying in 3 seconds...
echo.
timeout /t 3 /nobreak >nul
goto RETRY
