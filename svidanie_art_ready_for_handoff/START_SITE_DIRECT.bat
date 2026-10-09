@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
cls
echo Starting svidanie_art directly...
echo.
echo Folder:
cd
echo.
echo Keep this window open.
echo When you see "Ready", open:
echo http://localhost:3000/admin
echo.
if not exist "node_modules\.bin\next.cmd" (
  echo ERROR: next.cmd is missing. Dependencies are not installed.
  echo Send a screenshot of this window.
  pause
  exit /b 1
)
call "node_modules\.bin\next.cmd" dev -H 127.0.0.1 -p 3000
echo.
echo Server stopped. Send a screenshot of the message above.
pause
