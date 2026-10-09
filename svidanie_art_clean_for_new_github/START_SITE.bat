@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting svidanie_art local server...
echo.
echo Keep this window open while you use the site.
echo Admin: http://localhost:3000/admin
echo.
if not exist "node_modules\.bin\next.cmd" (
  echo Dependencies are missing. Installing now...
  call "C:\Program Files\nodejs\npm.cmd" install --cache .\.npm-cache
)
echo.
call "C:\Program Files\nodejs\npm.cmd" run dev
echo.
echo Server stopped. Copy the message above or send a screenshot.
pause
