#!/bin/bash

# SmartReport Pro - Hostinger SSH Deployment Script
# This script deploys the frontend to Hostinger using SSH

echo "🚀 Starting SmartReport Pro deployment to Hostinger..."

# Configuration
HOSTINGER_HOST="us-imm-web1145.main-hosting.eu"
HOSTINGER_USER="u984847094"
REMOTE_PATH="/domains/smartreportpro.aizetecc.com/public_html"
LOCAL_PATH="./"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if rsync is available
if ! command -v rsync &> /dev/null; then
    print_error "rsync is not installed. Please install rsync first."
    exit 1
fi

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa ] && [ ! -f ~/.ssh/id_ed25519 ]; then
    print_warning "No SSH key found. Make sure you have SSH access configured."
fi

print_status "Deploying frontend files to Hostinger..."

# Create backup of current deployment
print_status "Creating backup of current deployment..."
ssh ${HOSTINGER_USER}@${HOSTINGER_HOST} "cd ${REMOTE_PATH} && tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz ." 2>/dev/null || print_warning "Could not create backup"

# Deploy files using rsync
print_status "Syncing files to Hostinger..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.env' \
    --exclude='*.log' \
    --exclude='deploy/' \
    --exclude='backend/' \
    --exclude='README.md' \
    --exclude='package.json' \
    --exclude='.gitignore' \
    ${LOCAL_PATH} ${HOSTINGER_USER}@${HOSTINGER_HOST}:${REMOTE_PATH}/

# Check if deployment was successful
if [ $? -eq 0 ]; then
    print_success "Files deployed successfully!"
else
    print_error "Deployment failed!"
    exit 1
fi

# Set proper permissions
print_status "Setting file permissions..."
ssh ${HOSTINGER_USER}@${HOSTINGER_HOST} "cd ${REMOTE_PATH} && chmod -R 755 . && chmod 644 *.html *.css *.js *.jpg *.png *.csv"

# Create .htaccess file
print_status "Creating .htaccess file..."
cat > .htaccess << 'EOF'
# SmartReport Pro - Apache Configuration
RewriteEngine On

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# API routing to Vercel backend (update with your Vercel URL)
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ https://smartreport-pro-backend.vercel.app/api/$1 [P,L]

# Serve static files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# File upload limits
php_value upload_max_filesize 50M
php_value post_max_size 50M
php_value max_execution_time 300

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/css application/javascript
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
</IfModule>

# Prevent access to sensitive files
<FilesMatch "\.(env|log|config)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Prevent directory browsing
Options -Indexes
EOF

# Upload .htaccess
scp .htaccess ${HOSTINGER_USER}@${HOSTINGER_HOST}:${REMOTE_PATH}/

# Clean up local .htaccess
rm .htaccess

# Test deployment
print_status "Testing deployment..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://smartreportpro.aizetecc.com)

if [ "$HTTP_STATUS" = "200" ]; then
    print_success "Deployment successful! Site is accessible at https://smartreportpro.aizetecc.com"
else
    print_warning "Site might not be accessible yet. HTTP Status: $HTTP_STATUS"
fi

print_success "🎉 SmartReport Pro frontend deployed to Hostinger!"
print_status "Next steps:"
print_status "1. Deploy backend to Vercel"
print_status "2. Configure database in Hostinger"
print_status "3. Set up Firebase authentication"
print_status "4. Test the complete application"

echo ""
print_status "Deployment completed at $(date)"
