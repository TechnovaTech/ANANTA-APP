@echo off
echo ========================================
echo Testing ANANTA Backend Connection
echo ========================================
echo.

echo Testing Backend (Port 8082)...
curl -s http://localhost:8082/api/app/health
echo.
echo.

echo Testing Next.js Proxy (Port 3000)...
curl -s http://localhost:3000/api/app/health
echo.
echo.

echo ========================================
echo If you see "status":"OK" above, backend is working!
echo If you see connection errors, start the backend with START_BACKEND.bat
echo ========================================
pause
