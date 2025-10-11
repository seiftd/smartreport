# 📁 Manual Upload Guide - SmartReport Pro to Hostinger

Since SSH might not be available, here's how to manually upload your files to Hostinger:

## **Method 1: Using Hostinger File Manager (Easiest)**

### **Step 1: Access Hostinger File Manager**
1. Login to your **Hostinger Control Panel**
2. Go to **"File Manager"**
3. Navigate to **`public_html`** folder

### **Step 2: Upload Frontend Files**
Upload these files to `public_html`:

```
📁 public_html/
├── 📄 index.html
├── 📄 dashboard.html
├── 📁 styles/
│   ├── 📄 main.css
│   ├── 📄 components.css
│   └── 📄 responsive.css
├── 📁 js/
│   ├── 📄 app.js
│   ├── 📄 auth.js
│   ├── 📄 dashboard.js
│   ├── 📄 charts.js
│   └── 📄 firebase-config.js
├── 🖼️ logo.jpg
├── 🖼️ banner.jpg
├── 📄 demo-data.csv
└── 📄 .htaccess (create this)
```

### **Step 3: Create .htaccess File**
In the File Manager, create a new file called `.htaccess` with this content:

```apache
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
```

---

## **Method 2: Using FileZilla (Recommended)**

### **Step 1: Download FileZilla**
1. Go to [FileZilla.org](https://filezilla-project.org/)
2. Download **FileZilla Client** (free)
3. Install and open FileZilla

### **Step 2: Connect to Hostinger**
1. **Host**: `us-imm-web1145.main-hosting.eu`
2. **Username**: `u984847094`
3. **Password**: Your Hostinger password
4. **Port**: `21` (FTP) or `22` (SFTP)

### **Step 3: Upload Files**
1. Navigate to `/domains/smartreportpro.aizetecc.com/public_html/`
2. Upload all your frontend files
3. Set permissions: 755 for folders, 644 for files

---

## **Method 3: Using WinSCP (Windows)**

### **Step 1: Download WinSCP**
1. Go to [WinSCP.net](https://winscp.net/)
2. Download and install WinSCP

### **Step 2: Connect**
1. **File Protocol**: SFTP
2. **Host Name**: `us-imm-web1145.main-hosting.eu`
3. **User Name**: `u984847094`
4. **Password**: Your Hostinger password

### **Step 3: Upload**
1. Navigate to `/domains/smartreportpro.aizetecc.com/public_html/`
2. Drag and drop your files
3. Set permissions

---

## **Method 4: Using Git (If Available)**

### **Step 1: Clone Repository**
```bash
# On Hostinger server
git clone https://github.com/your-username/smartreport-pro.git
```

### **Step 2: Copy Files**
```bash
# Copy frontend files
cp -r smartreport-pro/* /domains/smartreportpro.aizetecc.com/public_html/
```

---

## **Quick Upload Checklist**

### **Files to Upload:**
- [ ] `index.html`
- [ ] `dashboard.html`
- [ ] `styles/` folder (3 CSS files)
- [ ] `js/` folder (5 JavaScript files)
- [ ] `logo.jpg`
- [ ] `banner.jpg`
- [ ] `demo-data.csv`
- [ ] `.htaccess` file

### **After Upload:**
- [ ] Test website: `https://smartreportpro.aizetecc.com`
- [ ] Check if all files are accessible
- [ ] Verify .htaccess is working
- [ ] Test responsive design

---

## **Troubleshooting**

### **File Upload Issues:**
- Check file permissions (755 for folders, 644 for files)
- Ensure all files are uploaded completely
- Verify file names match exactly

### **Website Not Loading:**
- Check if `index.html` is in the root of `public_html`
- Verify `.htaccess` file exists
- Check Hostinger error logs

### **CSS/JS Not Loading:**
- Check file paths in HTML
- Verify files are uploaded correctly
- Check browser console for errors

---

## **Next Steps After Upload:**

1. **Deploy Backend to Vercel**
2. **Create MySQL Database in Hostinger**
3. **Configure Firebase Authentication**
4. **Test Complete Application**

Your SmartReport Pro SaaS will be live once all steps are completed! 🚀
