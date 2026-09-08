@echo off
echo =======================================================
echo     MAISON AURA — RESTARTING ALL SERVICES
echo =======================================================
call "%~dp0stop.bat"
call "%~dp0start.bat"
