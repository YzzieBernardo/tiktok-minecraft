@echo off
title TikTok Minecraft Bot

cd /d "E:\tiktok-minecraft\Minecraft Live\React Dashboard"

echo ==========================================
echo   TikTok Minecraft Bot
echo ==========================================
echo.
echo Starting Node server...
echo.

node src\services\core\index.js

echo.
echo Bot process ended.
pause