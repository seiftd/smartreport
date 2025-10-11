# SmartReport Pro - Hostinger MySQL Deployment Guide

## 🚀 **Free Hosting Solution: Hostinger + Vercel**

### **Architecture Overview**
- **Frontend**: Hostinger (smartreportpro.aizetecc.com)
- **Backend API**: Vercel (free serverless functions)
- **Database**: Hostinger MySQL
- **Authentication**: Firebase (free)
- **Payments**: Lemon Squeezy (when ready)

---

## **Step 1: Database Setup in Hostinger**

### 1.1 Create MySQL Database
1. Login to your **Hostinger Control Panel**
2. Go to **"MySQL Databases"**
3. Create a new database:
   - **Database Name**: `u984847094_smartreport`
   - **Username**: `u984847094_smartreport`
   - **Password**: `your-secure-password`
4. **Note down these credentials** - you'll need them for the backend

### 1.2 Database Tables
The backend will automatically create these tables:
- `users` - User accounts and subscriptions
- `reports` - Generated reports
- `templates` - Report templates

---

## **Step 2: Backend Deployment to Vercel**

### 2.1 Prepare Backend for Vercel
```bash
# In your backend folder
cd backend
npm install
```

### 2.2 Create Vercel Configuration
The `vercel.json` file is already created in the backend folder.

### 2.3 Environment Variables
Create a `.env` file in the backend folder:
```env
# Database Configuration (Hostinger MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u984847094_smartreport
DB_USER=u984847094_smartreport
DB_PASSWORD=your-database-password

# Firebase Configuration
FIREBASE_PROJECT_ID=smartreport-pro
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@smartreport-pro.iam.gserviceaccount.com

# Security
JWT_SECRET=your-super-secret-jwt-key-32-characters-long
FRONTEND_URL=https://smartreportpro.aizetecc.com
```

### 2.4 Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your repository
4. Deploy the `backend` folder
5. Add environment variables in Vercel dashboard
6. **Note the deployment URL** (e.g., `https://smartreport-pro-backend.vercel.app`)

---

## **Step 3: Frontend Deployment to Hostinger**

### 3.1 Upload Frontend Files
Upload these files to your Hostinger `public_html` folder:
```
public_html/
├── index.html
├── dashboard.html
├── styles/
│   ├── main.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── charts.js
│   └── firebase-config.js
├── logo.jpg
├── banner.jpg
└── demo-data.csv
```

### 3.2 Update API URLs
Update the API base URL in your JavaScript files:
```javascript
// In js/auth.js and other files
this.apiBaseUrl = 'https://your-vercel-backend-url.vercel.app/api';
```

### 3.3 Configure .htaccess
Create `.htaccess` file in `public_html`:
```apache
# SmartReport Pro - Apache Configuration
RewriteEngine On

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"

# API routing to Vercel backend
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ https://your-vercel-backend-url.vercel.app/api/$1 [P,L]

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

# Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
</IfModule>
```

---

## **Step 4: Firebase Configuration**

### 4.1 Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Use your existing project: **smartreport-pro**
3. Enable **Authentication** with Google provider
4. Enable **Firestore Database** (for user management)
5. Download **Service Account Key**

### 4.2 Update Firebase Config
Your Firebase config is already set in `js/firebase-config.js`:
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

## **Step 5: Testing Your Deployment**

### 5.1 Test Frontend
1. Visit: `https://smartreportpro.aizetecc.com`
2. Check if the site loads correctly
3. Test responsive design on mobile

### 5.2 Test Authentication
1. Click "Get Started" or "Login"
2. Try Google OAuth login
3. Check if user is created in database

### 5.3 Test Backend API
1. Check: `https://your-vercel-backend-url.vercel.app/health`
2. Should return: `{"status":"OK","timestamp":"...","uptime":...}`

### 5.4 Test Database Connection
1. Check Vercel logs for database connection
2. Verify tables are created in Hostinger MySQL

---

## **Step 6: Production Checklist**

- [ ] ✅ Hostinger MySQL database created
- [ ] ✅ Vercel backend deployed
- [ ] ✅ Frontend uploaded to Hostinger
- [ ] ✅ Firebase authentication working
- [ ] ✅ API endpoints responding
- [ ] ✅ Database tables created
- [ ] ✅ SSL certificate enabled
- [ ] ✅ .htaccess configured
- [ ] ✅ Environment variables set
- [ ] ✅ Error monitoring setup

---

## **Cost Breakdown (FREE)**

| Service | Cost | Features |
|---------|------|----------|
| **Hostinger** | $0 (using existing plan) | Frontend hosting, MySQL database |
| **Vercel** | $0 (free tier) | Backend API, serverless functions |
| **Firebase** | $0 (free tier) | Authentication, analytics |
| **Total** | **$0/month** | Complete SaaS platform |

---

## **Troubleshooting**

### Common Issues:

1. **CORS Errors**
   - Check Vercel CORS configuration
   - Verify frontend URL in backend

2. **Database Connection Failed**
   - Verify Hostinger MySQL credentials
   - Check if database exists

3. **Firebase Authentication Failed**
   - Verify Firebase project configuration
   - Check service account key

4. **API Not Responding**
   - Check Vercel deployment logs
   - Verify environment variables

### Support Resources:
- [Hostinger Documentation](https://support.hostinger.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

---

## **Next Steps (When Ready)**

1. **Add Lemon Squeezy** for payments
2. **Implement email notifications**
3. **Add monitoring and analytics**
4. **Scale with more features**

Your SmartReport Pro SaaS is now **completely free and ready for production**! 🚀
