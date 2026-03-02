@echo off
REM Stop the server running on port 3000

echo Stopping server on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping process %%a...
    taskkill /PID %%a /F
)

echo Done!
