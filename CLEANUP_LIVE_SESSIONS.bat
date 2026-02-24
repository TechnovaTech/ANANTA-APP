@echo off
title Cleanup Old Live Sessions
color 0C

echo.
echo ════════════════════════════════════════════════
echo    Cleaning Up Old Live Sessions
echo ════════════════════════════════════════════════
echo.

cd /d D:\Office\ANANTA-APP\Anantaapp
node cleanup-live-sessions.mjs

echo.
pause
