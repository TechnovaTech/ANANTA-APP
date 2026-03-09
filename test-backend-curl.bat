@echo off
echo ========================================
echo BACKEND API COMPREHENSIVE TEST
echo ========================================
echo.

set API_URL=https://ecofuelglobal.com

echo [1] Testing Health Endpoint...
curl -X GET "%API_URL%/api/app/health" -H "Content-Type: application/json"
echo.
echo.

echo [2] Testing Check-Username Endpoint (WITHOUT userId)...
curl -X GET "%API_URL%/api/app/check-username?username=testuser" -H "Content-Type: application/json"
echo.
echo.

echo [3] Testing Check-Username Endpoint (WITH userId)...
curl -X GET "%API_URL%/api/app/check-username?username=jgjfhd&userId=ANAD2E8B50" -H "Content-Type: application/json"
echo.
echo.

echo [4] Testing Profile Endpoint...
curl -X GET "%API_URL%/api/app/profile/ANAD2E8B50" -H "Content-Type: application/json"
echo.
echo.

echo [5] Testing All Endpoints Summary...
echo.
echo Health: GET %API_URL%/api/app/health
curl -s -o nul -w "Status: %%{http_code}\n" "%API_URL%/api/app/health"
echo.
echo Check-Username: GET %API_URL%/api/app/check-username
curl -s -o nul -w "Status: %%{http_code}\n" "%API_URL%/api/app/check-username?username=test"
echo.
echo Profile: GET %API_URL%/api/app/profile/ANAD2E8B50
curl -s -o nul -w "Status: %%{http_code}\n" "%API_URL%/api/app/profile/ANAD2E8B50"
echo.

echo ========================================
echo TEST COMPLETE
echo ========================================
echo.
echo If check-username returns 404, the backend needs restart!
pause
