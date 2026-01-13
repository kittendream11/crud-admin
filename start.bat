@echo off
REM Startup script for CRUD Admin System on Windows

echo.
echo 🚀 Starting CRUD Admin System...
echo ================================
echo.

REM Start Backend
echo 📦 Starting Backend on Port 3000...
cd backend

REM Check and install dependencies
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

echo.
echo ✓ Starting Backend server...
start cmd /k "npm run start:dev"

REM Wait for backend to start
timeout /t 5 /nobreak

REM Start Frontend
echo.
echo ⚛️  Starting Frontend on Port 3001...
cd ..\frontend

REM Check and install dependencies
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

echo.
echo ✓ Starting Frontend server...
start cmd /k "npm run dev"

REM Wait for frontend to start
timeout /t 5 /nobreak

cd ..

REM Print summary
echo.
echo ================================
echo ✅ All services started!
echo ================================
echo.
echo 📍 ENDPOINTS:
echo    Frontend:  http://localhost:3001
echo    Backend:   http://localhost:3000
echo    API Docs:  http://localhost:3000/api/docs
echo.
echo 👤 Default Test Account:
echo    Email:    admin@example.com
echo    Password: password123
echo.
echo ⚙️  To stop services, close the terminal windows.
echo.
pause
