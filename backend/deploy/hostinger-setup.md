# SmartReport Pro - Hostinger Deployment Guide

## 🚀 Deployment to smartreportpro.aizetecc.com

### Prerequisites
- Hostinger hosting account
- Domain: smartreportpro.aizetecc.com
- Node.js hosting support (VPS or Cloud Hosting)

### Step 1: Backend Deployment

#### 1.1 Upload Backend Files
```bash
# Upload these files to your Hostinger server:
backend/
├── server.js
├── package.json
├── config/
├── routes/
├── services/
├── middleware/
└── utils/
```

#### 1.2 Install Dependencies
```bash
cd backend
npm install
```

#### 1.3 Environment Configuration
Create `.env` file with your credentials:
```env
PORT=3000
NODE_ENV=production
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
LEMON_SQUEEZY_API_KEY=your-lemon-squeezy-api-key
LEMON_SQUEEZY_STORE_ID=your-store-id
LEMON_SQUEEZY_WEBHOOK_SECRET=your-webhook-secret
FRONTEND_URL=https://smartreportpro.aizetecc.com
JWT_SECRET=your-super-secret-jwt-key
```

#### 1.4 Start Backend Service
```bash
# Using PM2 for process management
npm install -g pm2
pm2 start server.js --name "smartreport-api"
pm2 save
pm2 startup
```

### Step 2: Frontend Deployment

#### 2.1 Upload Frontend Files
Upload all frontend files to your domain's public_html directory:
```
public_html/
├── index.html
├── dashboard.html
├── styles/
├── js/
├── logo.jpg
├── banner.jpg
└── demo-data.csv
```

#### 2.2 Update API URLs
Update the API base URL in your JavaScript files:
```javascript
// In js/auth.js and other files
this.apiBaseUrl = 'https://smartreportpro.aizetecc.com/api';
```

### Step 3: Firebase Configuration

#### 3.1 Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: "SmartReport Pro"
3. Enable Authentication with Google provider
4. Enable Firestore Database
5. Download service account key

#### 3.2 Firebase Web Configuration
Update `js/firebase-config.js`:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Step 4: Lemon Squeezy Configuration

#### 4.1 Lemon Squeezy Setup
1. Go to [Lemon Squeezy](https://app.lemonsqueezy.com/)
2. Create a new store
3. Add your products (Free, Pro, Business plans)
4. Get your API key and store ID
5. Configure webhooks pointing to: `https://smartreportpro.aizetecc.com/api/webhooks/lemonsqueezy`

#### 4.2 Product Configuration
Create these products in Lemon Squeezy:

**Free Plan**
- Price: $0/month
- Variant ID: free_variant_123

**Pro Plan**
- Price: $19/month
- Variant ID: pro_variant_456

**Business Plan**
- Price: $49/month
- Variant ID: business_variant_789

### Step 5: SSL and Security

#### 5.1 SSL Certificate
Enable SSL certificate in Hostinger control panel for your domain.

#### 5.2 Security Headers
Add these headers to your .htaccess file:
```apache
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

### Step 6: Monitoring and Analytics

#### 6.1 Google Analytics
Add Google Analytics tracking code to your HTML files.

#### 6.2 Error Monitoring
Consider adding Sentry or similar error monitoring service.

### Step 7: Testing

#### 7.1 Test Authentication
1. Visit https://smartreportpro.aizetecc.com
2. Try Google OAuth login
3. Verify user creation in Firebase

#### 7.2 Test Payments
1. Create a test checkout
2. Verify webhook handling
3. Test subscription management

#### 7.3 Test File Upload
1. Upload CSV/Excel files
2. Verify file processing
3. Test report generation

### Step 8: Production Checklist

- [ ] SSL certificate enabled
- [ ] Firebase authentication working
- [ ] Lemon Squeezy payments working
- [ ] File uploads working
- [ ] Report generation working
- [ ] Email notifications working
- [ ] Webhook handling working
- [ ] Error monitoring setup
- [ ] Analytics tracking
- [ ] Backup strategy in place

### Troubleshooting

#### Common Issues:
1. **CORS errors**: Check backend CORS configuration
2. **Firebase errors**: Verify service account credentials
3. **Payment issues**: Check Lemon Squeezy webhook configuration
4. **File upload errors**: Check file size limits and permissions

#### Logs Location:
- Backend logs: Check PM2 logs with `pm2 logs smartreport-api`
- Web server logs: Check Hostinger error logs
- Firebase logs: Check Firebase console

### Support
For deployment issues, check:
- Hostinger documentation
- Firebase documentation
- Lemon Squeezy documentation
- Node.js deployment guides
