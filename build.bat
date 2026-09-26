@echo off
title Bundle Shiwant Goyal Portfolio
echo Bundling src/components into app.bundle.jsx and index.html...

if exist "C:\msys64\ucrt64\bin\python.exe" (
    "C:\msys64\ucrt64\bin\python.exe" "%~dp0bundle.py"
) else (
    python "%~dp0bundle.py"
)

echo.
echo Bundle complete!
timeout /t 3
