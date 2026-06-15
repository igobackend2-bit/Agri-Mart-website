@echo off
echo Copying product images from all Igo- sibling projects...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0copy-catalog-images.ps1"
echo.
echo Done! Press any key to close.
pause
