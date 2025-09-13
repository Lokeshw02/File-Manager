@echo off
setlocal enabledelayedexpansion

REM File Manager Setup Script for Windows
REM This script sets up the entire project for new users

echo.
echo 🚀 Setting up File Manager Project...
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)
echo [SUCCESS] Node.js found

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed. Please install Java 11 or higher.
    echo Visit: https://adoptium.net/
    pause
    exit /b 1
)
echo [SUCCESS] Java found

echo.
echo [INFO] Installing frontend dependencies...

REM Check if package.json exists
if not exist "web-src\package.json" (
    echo [ERROR] package.json not found in web-src directory
    pause
    exit /b 1
)

REM Install dependencies
if not exist "web-src\node_modules" (
    echo [INFO] Running npm install...
    cd web-src
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install npm dependencies
        pause
        exit /b 1
    )
) else (
    echo [WARNING] node_modules already exists, skipping npm install
)

echo [SUCCESS] Frontend dependencies installed

echo.
echo [INFO] Building React frontend...

REM Build the React app
cd web-src
call npm run build
cd ..
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build frontend
    pause
    exit /b 1
)

echo [SUCCESS] Frontend build completed

echo.
echo [INFO] Copying frontend build to Spring Boot static folder...

REM Create static directory if it doesn't exist
if not exist "src\main\resources\static" mkdir "src\main\resources\static"

REM Remove existing static files
if exist "src\main\resources\static\*" (
    del /q "src\main\resources\static\*"
    for /d %%i in ("src\main\resources\static\*") do rmdir /s /q "%%i"
)

REM Copy new build files
xcopy "web-src\build\*" "src\main\resources\static\" /E /I /Y >nul

echo [SUCCESS] Frontend build copied to static folder

echo.
echo [INFO] Building Spring Boot application...

REM Build the JAR
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build Spring Boot application
    pause
    exit /b 1
)

echo [SUCCESS] Spring Boot JAR built successfully

echo.
echo ==================================
echo [SUCCESS] 🎉 Setup completed successfully!
echo.
echo To run the application:
echo   java -jar target\demo-*.jar
echo.
echo Then open your browser and go to:
echo   http://localhost:8080
echo.
echo Happy coding! 🚀
echo.
pause
