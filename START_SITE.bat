@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting svidanie_art local server...
echo.
echo Keep this window open while you use the site.
echo Admin: http://localhost:3000/admin
echo Email: admin@svidanie.art
echo Password: Admin123!
echo.
if not exist "node_modules\.bin\next.cmd" (
  echo Dependencies are missing. Installing now...
  call "C:\Program Files\nodejs\npm.cmd" install --cache .\.npm-cache
)
echo.
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
  echo Port 3000 is already used by process %%a. Stopping it...
  taskkill /PID %%a /F >nul 2>nul
)

start "" cmd /c "timeout /t 5 /nobreak >nul && start "" "http://localhost:3000/admin""
call "node_modules\.bin\next.cmd" dev -H 127.0.0.1 -p 3000
echo.
echo Server stopped. Copy the message above or send a screenshot.
pause
