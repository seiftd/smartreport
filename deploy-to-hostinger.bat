@echo off
echo Deploying SmartReport Pro to Hostinger...

REM Build the project
echo Building React app...
cd frontend
call npm run build
cd ..

REM Create deployment package
echo Creating deployment package...
if exist deploy-package rmdir /s /q deploy-package
mkdir deploy-package
xcopy frontend\dist\* deploy-package\ /E /I /Y

echo.
echo ========================================
echo DEPLOYMENT PACKAGE READY!
echo ========================================
echo.
echo Files to upload to Hostinger:
echo - Upload everything from 'deploy-package' folder'
echo - Upload to 'public_html' directory on Hostinger
echo.
echo Steps:
echo 1. Login to Hostinger Control Panel
echo 2. Go to File Manager
echo 3. Navigate to public_html
echo 4. Upload all files from deploy-package folder
echo 5. Your site will be live at: https://smartreportpro.aizetecc.com
echo.
pause
