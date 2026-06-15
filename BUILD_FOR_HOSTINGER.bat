@echo off
cd /d "D:\Igo-websites\Igo-AgriMart"
echo ============================================
echo  IGO Agri Mart - Production Build
echo ============================================
echo Building the latest website into the dist folder...
call npm run build
echo.
echo DONE! Upload the entire "dist" folder contents
echo (including .htaccess) to Hostinger public_html.
echo ============================================
pause
