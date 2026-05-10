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
echo [1/4] Checking dependencies...
cd backend
if not exist venv\Scripts\python.exe (
    echo [ERROR] Virtual environment not found in backend/venv. Please create it first.
    pause
    exit /b
)
venv\Scripts\pip install -r requirements.txt --quiet

:: Run migrations just in case
echo [2/4] Preparing database...
venv\Scripts\python manage.py migrate --noinput >nul 2>&1

:: Start Django Backend in a new minimized window
echo [3/4] Launching Backend Server...
start /min "JobFinder Backend" cmd /c "venv\Scripts\python manage.py runserver"
cd ..

:: Start Frontend Server in a new minimized window
echo [4/4] Launching Frontend Server...
cd frontend
start /min "JobFinder Frontend" cmd /c "python -m http.server 8080"
cd ..

:: Wait for server to initialize
timeout /t 3 /nobreak > nul

:: Open the Frontend Landing Page
echo Opening Frontend Application...
start "" "http://localhost:8080/index.html"

echo.
echo ======================================================
echo ✅ SUCCESS: JobFinder is now running!
echo.
echo API GATEWAY:  http://127.0.0.1:8000/
echo ADMIN PANEL:  http://127.0.0.1:8000/admin/
echo FRONTEND:     http://localhost:8080/index.html
echo.
echo (Keep the minimized command window open to maintain the connection)
echo ======================================================
echo.
pause
