@echo off
echo Creating module.zip for GitHub release...
echo.

REM Remove old zip if it exists
if exist module.zip del module.zip

REM Create zip using PowerShell
powershell -command "Compress-Archive -Path module.json, README.md, GITHUB_SETUP.md, scripts, styles, lang -DestinationPath module.zip -Force"

echo.
echo module.zip created successfully!
echo Upload this file to your GitHub release as "module.zip"
echo.
pause
