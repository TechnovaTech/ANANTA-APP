@echo off
echo ========================================
echo Starting ANANTA Backend (Java Spring Boot)
echo ========================================
echo.

cd adminpanel\backend

echo Checking if Maven is installed...
call mvn --version
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven from https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot application on port 8082...
echo.

call mvn spring-boot:run

pause
