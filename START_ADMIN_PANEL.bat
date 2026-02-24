@echo off
echo ========================================
echo Starting ANANTA Admin Panel (Next.js)
echo ========================================
echo.

cd adminpanel

echo Installing dependencies if needed...
if not exist "node_modules\" (
    echo Installing npm packages...
    call npm install
)

echo.
echo Starting Next.js on port 3000...
echo This will proxy API requests to backend on port 8082
echo.

call npm run dev

pause
