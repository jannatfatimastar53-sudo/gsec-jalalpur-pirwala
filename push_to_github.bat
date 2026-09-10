@echo off
echo ===================================================
echo Pushing Govt. Special Education Centre to GitHub...
echo Repository: https://github.com/jannatfatimastar53-sudo/gsec-jalalpur-pirwala.git
echo ===================================================
echo.

cd /d "%~dp0"
git branch -M main
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Project uploaded successfully to GitHub!
) else (
    echo [ERROR] Push failed. If prompted for password, please use a GitHub Personal Access Token (PAT).
)
echo.
pause
