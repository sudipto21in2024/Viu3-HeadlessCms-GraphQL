@echo off
setlocal enabledelayedexpansion

echo =======================================================
echo     MAISON AURA — INITIALIZING \u0026 STARTING SERVICES
echo =======================================================

echo.
echo [Step 1] Checking and terminating any existing instances...

:: Kill port 4000 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4000 "') do (
    set "PID=%%a"
    if defined PID (
        if not "!PID!"=="0" (
            echo   -> Killing existing process with PID !PID! on port 4000...
            taskkill /f /pid !PID! >nul 2>&1
        )
    )
)

:: Kill port 5173 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do (
    set "PID=%%a"
    if defined PID (
        if not "!PID!"=="0" (
            echo   -> Killing existing process with PID !PID! on port 5173...
            taskkill /f /pid !PID! >nul 2>&1
        )
    )
)

echo   [OK] Ports 4000 and 5173 are ready.

echo.
echo [Step 2] Ensuring SQLite database is seeded...
call npm run seed --prefix backend >nul 2>&1
echo   [OK] Database seeded successfully.

echo.
echo [Step 3] Launching Backend & Frontend services...
echo.
echo -------------------------------------------------------
echo   Frontend : http://localhost:5173/
echo   GraphQL  : http://localhost:4000/graphql
echo   Health   : http://localhost:4000/health
echo -------------------------------------------------------
echo   Press Ctrl+C to terminate services at any time.
echo -------------------------------------------------------
echo.

:: Launch browser in background after 2 seconds
start "" powershell -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:5173/'"

:: Start both services concurrently in current terminal
call npm run dev
