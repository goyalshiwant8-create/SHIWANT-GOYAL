@echo off
title Shiwant Goyal - Demon Slayer Portfolio
echo ========================================================
echo   SHIWANT GOYAL // DEMON SLAYER DEVELOPER PORTFOLIO ⚔️
echo   Total Concentration: Slay the Bugs, Forge the Future
echo ========================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] Starting local web server on http://localhost:3000 ...
    start "" http://localhost:3000
    python -m http.server 3000
) else (
    if exist "C:\msys64\ucrt64\bin\python.exe" (
        echo [✓] Starting local web server via MSYS Python on http://localhost:3000 ...
        start "" http://localhost:3000
        "C:\msys64\ucrt64\bin\python.exe" -m http.server 3000
    ) else (
        echo [✓] Opening portfolio directly in default browser ...
        start "" "%~dp0index.html"
    )
)
pause
