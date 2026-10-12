@echo off
echo ===================================================
echo   Starting AI EduPlay Backend (FastAPI + AI Engine)
echo ===================================================
cd /d "%~dp0backend"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
