@echo off

REM File Manager Run Script for Windows
REM This script runs the built Spring Boot application

echo.
echo 🚀 Starting File Manager...
echo ==========================

REM Check if JAR exists
for %%i in (target\*.jar) do (
    if not "%%i"=="%%i:original" set JAR_FILE=%%i
)

if "%JAR_FILE%"=="" (
    echo ❌ No JAR file found. Please run setup.bat first.
    pause
    exit /b 1
)

echo [INFO] Found JAR: %JAR_FILE%
echo [INFO] Starting application on http://localhost:8080
echo.

REM Run the application
java -jar "%JAR_FILE%"
