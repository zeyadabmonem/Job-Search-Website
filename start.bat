@echo off
SETLOCAL EnableDelayedExpansion

echo ======================================================
echo          🚀 JOBFINDER SYSTEM STARTUP 🚀
echo ======================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    pause
    exit /b
)

:: Install missing dependencies silently
echo [1/3] Checking dependencies...
pip install -r backend/requirements.txt --quiet

:: Run migrations just in case
echo [2/3] Preparing database...
cd backend
python manage.py migrate --noinput >nul 2>&1
cd ..

:: Start Django Backend in a new minimized window
echo [3/3] Launching Backend Server...
start /min "JobFinder Backend" cmd /c "cd backend && python manage.py runserver"

:: Wait for server to initialize
timeout /t 3 /nobreak > nul

:: Open the Frontend Landing Page
echo [4/4] Opening Frontend Application...
start "" "frontend/index.html"

echo.
echo ======================================================
echo ✅ SUCCESS: JobFinder is now running!
echo.
echo API GATEWAY:  http://127.0.0.1:8000/
echo ADMIN PANEL:  http://127.0.0.1:8000/admin/
echo FRONTEND:     Opened in your browser
echo.
echo (Keep the minimized command window open to maintain the connection)
echo ======================================================
echo.
pause
