# 🚀 Quick Deploy Guide - SmartReport Pro to Hostinger

## **Using Your SSH Access**

Since you have SSH access to Hostinger, deployment is super easy!

### **Option 1: Automated Deployment (Recommended)**

#### **For Windows:**
```bash
# Run the deployment script
deploy\deploy-windows.bat
```

#### **For Linux/Mac:**
```bash
# Make script executable
chmod +x deploy/deploy.sh

# Run deployment
./deploy/deploy.sh
```

### **Option 2: Manual Deployment**

#### **Step 1: Upload Files via SSH**
```bash
# Upload all frontend files
scp -r index.html dashboard.html styles/ js/ logo.jpg banner.jpg demo-data.csv u984847094@us-imm-web1145.main-hosting.eu:/domains/smartreportpro.aizetecc.com/public_html/
```

#### **Step 2: Set Permissions**
```bash
# Set proper file permissions
ssh u984847094@us-imm-web1145.main-hosting.eu "cd /domains/smartreportpro.aizetecc.com/public_html && chmod -R 755 . && chmod 644 *.html *.css *.js *.jpg *.png *.csv"
```

#### **Step 3: Create .htaccess**
```bash
# Create .htaccess file on server
ssh u984847094@us-imm-web1145.main-hosting.eu "cat > /domains/smartreportpro.aizetecc.com/public_html/.htaccess << 'EOF'
# SmartReport Pro - Apache Configuration
RewriteEngine On

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection \"1; mode=block\"

# API routing to Vercel backend
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ https://smartreport-pro-backend.vercel.app/api/$1 [P,L]

# Serve static files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# File upload limits
php_value upload_max_filesize 50M
php_value post_max_size 50M

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/css application/javascript
</IfModule>
EOF"
```

---

## **Backend Deployment to Vercel**

### **Step 1: Prepare Backend**
```bash
cd backend
npm install
```

### **Step 2: Deploy to Vercel**
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy the `backend` folder
5. Add environment variables:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=u984847094_smartreport
   DB_USER=u984847094_smartreport
   DB_PASSWORD=your-database-password
   FIREBASE_PROJECT_ID=smartreport-pro
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://smartreportpro.aizetecc.com
   ```

### **Step 3: Update API URL**
Update the API URL in your JavaScript files:
```javascript
// In js/auth.js and other files
this.apiBaseUrl = 'https://your-vercel-backend-url.vercel.app/api';
```

---

## **Database Setup in Hostinger**

### **Step 1: Create MySQL Database**
1. Login to Hostinger Control Panel
2. Go to "MySQL Databases"
3. Create database:
   - **Name**: `u984847094_smartreport`
   - **User**: `u984847094_smartreport`
   - **Password**: `your-secure-password`

### **Step 2: Test Database Connection**
The backend will automatically create the required tables when it starts.

---

## **Firebase Configuration**

Your Firebase config is already set up:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDkrrYJZc2cSSuwovTaCHvksSYnRVOOFgs",
  authDomain: "smartreport-pro.firebaseapp.com",
  projectId: "smartreport-pro",
  storageBucket: "smartreport-pro.firebasestorage.app",
  messagingSenderId: "990789201953",
  appId: "1:990789201953:web:20b4c0b3a5610a4e61b360",
  measurementId: "G-B5KLV37LEQ"
};
```

---

## **Testing Your Deployment**

### **1. Test Frontend**
Visit: `https://smartreportpro.aizetecc.com`

### **2. Test Backend**
Visit: `https://your-vercel-backend-url.vercel.app/health`

### **3. Test Authentication**
Try Google OAuth login

### **4. Test Database**
Check Vercel logs for database connection

---

## **Quick Commands Summary**

```bash
# Deploy frontend (Windows)
deploy\deploy-windows.bat

# Deploy frontend (Linux/Mac)
./deploy/deploy.sh

# Manual upload
scp -r * u984847094@us-imm-web1145.main-hosting.eu:/domains/smartreportpro.aizetecc.com/public_html/

# Set permissions
ssh u984847094@us-imm-web1145.main-hosting.eu "cd /domains/smartreportpro.aizetecc.com/public_html && chmod -R 755 ."
```

---

## **Troubleshooting**

### **SSH Connection Issues**
```bash
# Test SSH connection
ssh u984847094@us-imm-web1145.main-hosting.eu

# Check if files uploaded
ssh u984847094@us-imm-web1145.main-hosting.eu "ls -la /domains/smartreportpro.aizetecc.com/public_html/"
```

### **Permission Issues**
```bash
# Fix permissions
ssh u984847094@us-imm-web1145.main-hosting.eu "cd /domains/smartreportpro.aizetecc.com/public_html && chmod -R 755 ."
```

### **API Connection Issues**
- Check Vercel deployment URL
- Verify environment variables
- Check CORS configuration

---

## **Success! 🎉**

Once deployed, your SmartReport Pro SaaS will be live at:
- **Frontend**: `https://smartreportpro.aizetecc.com`
- **Backend**: `https://your-vercel-backend-url.vercel.app`
- **Database**: Hostinger MySQL
- **Authentication**: Firebase
- **Cost**: $0/month (completely free!)

Your SaaS is now ready for users! 🚀
