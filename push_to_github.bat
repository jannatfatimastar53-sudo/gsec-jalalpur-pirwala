@echo off
title Uploading School Website to GitHub
color 0A
echo =================================================================
echo   Uploading Govt. Special Education Centre to GitHub
echo   Repository: https://github.com/jannatfatimastar53-sudo/gsec-jalalpur-pirwala.git
echo =================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Git branch...
git branch -M main

echo [2/3] Setting Remote Origin...
git remote set-url origin https://github.com/jannatfatimastar53-sudo/gsec-jalalpur-pirwala.git

echo [3/3] Uploading all files to GitHub...
echo (If a browser window opens, please click 'Sign in with your browser' / 'Authorize')
echo.
git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo =================================================================
    echo  [SUCCESS] All files uploaded to GitHub successfully!
    echo  Vercel will now automatically deploy the website!
    echo =================================================================
) else (
    echo =================================================================
    echo  [ERROR] Upload failed. Please check your internet or GitHub login.
    echo =================================================================
)
echo.
echo Press any key to close this window...
pause >nul
