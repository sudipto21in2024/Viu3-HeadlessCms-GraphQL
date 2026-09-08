@echo off
setlocal enabledelayedexpansion

echo =======================================================
echo     MAISON AURA — STOPPING ALL SERVICES
echo =======================================================

echo.
echo [1/2] Checking port 4000 (Backend GraphQL Server)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4000 "') do (
    set "PID=%%a"
    if defined PID (
        if not "!PID!"=="0" (
            echo   -> Killing process with PID !PID! on port 4000...
            taskkill /f /pid !PID! >nul 2>&1
        )
    )
)
echo   [OK] Port 4000 is clean.

echo.
echo [2/2] Checking port 5173 (Frontend Vite Server)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do (
    set "PID=%%a"
    if defined PID (
        if not "!PID!"=="0" (
            echo   -> Killing process with PID !PID! on port 5173...
            taskkill /f /pid !PID! >nul 2>&1
        )
    )
)
echo   [OK] Port 5173 is clean.

echo.
echo =======================================================
echo   [SUCCESS] All Maison Aura services have been stopped.
echo =======================================================
echo.
