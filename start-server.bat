@echo off
REM Stop any existing server on port 3000

echo Checking for existing server on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Found process %%a using port 3000
    taskkill /PID %%a /F >nul 2>&1
    echo Process stopped.
)

echo.
echo Starting server...
npm start
