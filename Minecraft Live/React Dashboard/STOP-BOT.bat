@echo off
title Stop TikTok Minecraft Bot

echo ==========================================
echo   Stopping TikTok Minecraft Bot
echo ==========================================
echo.

taskkill /F /IM node.exe 2>nul

if %errorlevel%==0 (
    echo.
    echo Node processes stopped.
) else (
    echo.
    echo No Node process was running.
)

echo.
pause