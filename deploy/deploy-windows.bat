@echo off
REM SmartReport Pro - Hostinger SSH Deployment Script for Windows
REM This script deploys the frontend to Hostinger using SSH

echo 🚀 Starting SmartReport Pro deployment to Hostinger...

REM Configuration
set HOSTINGER_HOST=us-imm-web1145.main-hosting.eu
set HOSTINGER_USER=u984847094
set REMOTE_PATH=/domains/smartreportpro.aizetecc.com/public_html
set LOCAL_PATH=./

echo [INFO] Deploying frontend files to Hostinger...

REM Create backup of current deployment
echo [INFO] Creating backup of current deployment...
ssh %HOSTINGER_USER%@%HOSTINGER_HOST% "cd %REMOTE_PATH% && tar -czf backup-$(date +%%Y%%m%%d-%%H%%M%%S).tar.gz ." 2>nul

REM Deploy files using rsync (if available) or scp
echo [INFO] Syncing files to Hostinger...

REM Try rsync first, fallback to scp if not available
where rsync >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Using rsync for deployment...
    rsync -avz --delete --exclude=".git" --exclude="node_modules" --exclude=".env" --exclude="*.log" --exclude="deploy/" --exclude="backend/" --exclude="README.md" --exclude="package.json" --exclude=".gitignore" %LOCAL_PATH% %HOSTINGER_USER%@%HOSTINGER_HOST%:%REMOTE_PATH%/
) else (
    echo [INFO] Using scp for deployment...
    scp -r index.html dashboard.html styles/ js/ logo.jpg banner.jpg demo-data.csv %HOSTINGER_USER%@%HOSTINGER_HOST%:%REMOTE_PATH%/
)

if %errorlevel% equ 0 (
    echo [SUCCESS] Files deployed successfully!
) else (
    echo [ERROR] Deployment failed!
    pause
    exit /b 1
)

REM Set proper permissions
echo [INFO] Setting file permissions...
ssh %HOSTINGER_USER%@%HOSTINGER_HOST% "cd %REMOTE_PATH% && chmod -R 755 . && chmod 644 *.html *.css *.js *.jpg *.png *.csv"

REM Create .htaccess file
echo [INFO] Creating .htaccess file...
(
echo # SmartReport Pro - Apache Configuration
echo RewriteEngine On
echo.
echo # Security headers
echo Header always set X-Frame-Options DENY
echo Header always set X-Content-Type-Options nosniff
echo Header always set X-XSS-Protection "1; mode=block"
echo Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
echo.
echo # API routing to Vercel backend ^(update with your Vercel URL^)
echo RewriteCond %%{REQUEST_URI} ^/api/^(.*^)$
echo RewriteRule ^/api/^(.*^)$ https://smartreport-pro-backend.vercel.app/api/$1 [P,L]
echo.
echo # Serve static files
echo RewriteCond %%{REQUEST_FILENAME} !-f
echo RewriteCond %%{REQUEST_FILENAME} !-d
echo RewriteRule ^^(.*^)$ index.html [QSA,L]
echo.
echo # File upload limits
echo php_value upload_max_filesize 50M
echo php_value post_max_size 50M
echo php_value max_execution_time 300
echo.
echo # Compression
echo ^<IfModule mod_deflate.c^>
echo     AddOutputFilterByType DEFLATE text/plain text/html text/css application/javascript
echo ^</IfModule^>
echo.
echo # Cache control
echo ^<IfModule mod_expires.c^>
echo     ExpiresActive On
echo     ExpiresByType text/css "access plus 1 month"
echo     ExpiresByType application/javascript "access plus 1 month"
echo     ExpiresByType image/png "access plus 1 month"
echo     ExpiresByType image/jpg "access plus 1 month"
echo     ExpiresByType image/jpeg "access plus 1 month"
echo ^</IfModule^>
echo.
echo # Prevent access to sensitive files
echo ^<FilesMatch "\.^(env^|log^|config^)$"^>
echo     Order allow,deny
echo     Deny from all
echo ^</FilesMatch^>
echo.
echo # Prevent directory browsing
echo Options -Indexes
) > .htaccess

REM Upload .htaccess
scp .htaccess %HOSTINGER_USER%@%HOSTINGER_HOST%:%REMOTE_PATH%/

REM Clean up local .htaccess
del .htaccess

REM Test deployment
echo [INFO] Testing deployment...
curl -s -o nul -w "%%{http_code}" https://smartreportpro.aizetecc.com > temp_status.txt
set /p HTTP_STATUS=<temp_status.txt
del temp_status.txt

if "%HTTP_STATUS%"=="200" (
    echo [SUCCESS] Deployment successful! Site is accessible at https://smartreportpro.aizetecc.com
) else (
    echo [WARNING] Site might not be accessible yet. HTTP Status: %HTTP_STATUS%
)

echo [SUCCESS] 🎉 SmartReport Pro frontend deployed to Hostinger!
echo [INFO] Next steps:
echo [INFO] 1. Deploy backend to Vercel
echo [INFO] 2. Configure database in Hostinger
echo [INFO] 3. Set up Firebase authentication
echo [INFO] 4. Test the complete application

echo.
echo [INFO] Deployment completed at %date% %time%
pause
