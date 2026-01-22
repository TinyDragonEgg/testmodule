@echo off
echo Updating GitHub repository...
echo.

cd /d "%~dp0"

echo Adding all changed files...
git add .

echo.
echo Committing changes...
git commit -m "Update to v1.0.1 - Built-in cultural origins"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo Done! Now create a release at:
echo https://github.com/TinyDragonEgg/testmodule/releases/new
echo.
echo Tag: 1.0.1
echo Upload the module.zip file
echo.
pause
