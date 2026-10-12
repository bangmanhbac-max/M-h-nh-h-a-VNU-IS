@echo off
echo =========================================================
echo   AI EduPlay Platform - Khoi Dong He Thong Toan Dien
echo =========================================================
echo 1. Dang khoi dong Backend FastAPI (Port 8000)...
start "AI EduPlay Backend" cmd /c "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo 2. Dang khoi dong Frontend React Vite (Port 3000)...
start "AI EduPlay Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

echo.
echo He thong dang chay tai: http://localhost:3000
echo Backend API docs tai: http://localhost:8000/docs
echo.
pause
