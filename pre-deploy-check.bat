@echo off
echo ========================================
echo   Pre-Deployment Verification
echo ========================================
echo.

echo [1/5] Checking package.json...
if exist package.json (
    echo   ✓ package.json found
) else (
    echo   ✗ package.json not found
    exit /b 1
)

echo.
echo [2/5] Checking Prisma schema...
if exist prisma\schema.prisma (
    echo   ✓ Prisma schema found
    findstr /C:"postgresql" prisma\schema.prisma >nul
    if errorlevel 1 (
        echo   ✗ Schema not configured for PostgreSQL
        echo   Run: Update prisma\schema.prisma to use postgresql
    ) else (
        echo   ✓ PostgreSQL configured
    )
) else (
    echo   ✗ Prisma schema not found
)

echo.
echo [3/5] Checking migrations...
if exist prisma\migrations (
    echo   ✓ Migrations folder found
) else (
    echo   ✗ Migrations folder not found
)

echo.
echo [4/5] Checking .gitignore...
if exist .gitignore (
    echo   ✓ .gitignore found
) else (
    echo   ✗ .gitignore not found
)

echo.
echo [5/5] Testing server startup...
echo   Starting server on port 3002...
set PORT=3002
start /B node src/server.js
timeout /t 3 /nobreak >nul
curl -s http://localhost:3002/health >nul 2>&1
if errorlevel 1 (
    echo   ✗ Server failed to start or health check failed
) else (
    echo   ✓ Server started successfully
)

echo.
echo Stopping test server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do taskkill /F /PID %%a >nul 2>&1

echo.
echo ========================================
echo   Verification Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Review RENDER_DEPLOYMENT.md
echo   2. Push code to GitHub
echo   3. Deploy on Render
echo.
pause
