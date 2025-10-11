@echo off
echo 🚀 Building React Frontend for SmartReport Pro...

cd frontend

echo 📦 Installing dependencies...
call npm install

echo 🔨 Building production version...
call npm run build

echo 📁 Creating deployment package...
if exist "..\react-upload" rmdir /s /q "..\react-upload"
mkdir "..\react-upload"

echo 📋 Copying built files...
xcopy "dist\*" "..\react-upload\" /E /I /Y

echo 📄 Creating .htaccess for SPA routing...
echo RewriteEngine On > "..\react-upload\.htaccess"
echo RewriteBase / >> "..\react-upload\.htaccess"
echo RewriteRule ^index\.html$ - [L] >> "..\react-upload\.htaccess"
echo RewriteCond %%{REQUEST_FILENAME} !-f >> "..\react-upload\.htaccess"
echo RewriteCond %%{REQUEST_FILENAME} !-d >> "..\react-upload\.htaccess"
echo RewriteRule . /index.html [L] >> "..\react-upload\.htaccess"

echo ✅ React build completed!
echo 📁 Upload the contents of 'react-upload' folder to your Hostinger public_html directory
echo 🌐 Your React app will be available at: https://smartreportpro.aizetecc.com/

pause
