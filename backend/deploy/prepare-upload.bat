@echo off
REM SmartReport Pro - Prepare Files for Manual Upload
echo 🚀 Preparing SmartReport Pro files for manual upload...

REM Create upload directory
if not exist "upload" mkdir upload
if not exist "upload\styles" mkdir upload\styles
if not exist "upload\js" mkdir upload\js

echo [INFO] Copying frontend files...

REM Copy HTML files
copy index.html upload\
copy dashboard.html upload\

REM Copy CSS files
copy styles\main.css upload\styles\
copy styles\components.css upload\styles\
copy styles\responsive.css upload\styles\

REM Copy JavaScript files
copy js\app.js upload\js\
copy js\auth.js upload\js\
copy js\dashboard.js upload\js\
copy js\charts.js upload\js\
copy js\firebase-config.js upload\js\

REM Copy images and data
copy logo.jpg upload\
copy banner.jpg upload\
copy demo-data.csv upload\

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
echo # API routing to Vercel backend
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
) > upload\.htaccess

echo [SUCCESS] Files prepared in 'upload' folder!
echo.
echo [INFO] Next steps:
echo [INFO] 1. Go to Hostinger File Manager
echo [INFO] 2. Navigate to public_html folder
echo [INFO] 3. Upload all files from the 'upload' folder
echo [INFO] 4. Set permissions: 755 for folders, 644 for files
echo.
echo [INFO] Files ready for upload:
dir upload /b
echo.
echo [SUCCESS] 🎉 Ready for manual upload to Hostinger!
pause
