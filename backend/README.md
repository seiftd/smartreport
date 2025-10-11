# SmartReport Pro Backend

## 🚀 Deployment Instructions

### 1. Vercel Deployment
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `seiftd/smartreport`
4. Set **Root Directory** to: `backend`
5. Add Environment Variables (see below)

### 3. Environment Variables Required

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
# Database Configuration
DB_HOST=your_hostinger_mysql_host
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_key

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# Admin Credentials (hardcoded)
ADMIN_EMAIL=support@smartreportpro.aizetecc.com
ADMIN_PASSWORD=letmein
```

### 4. Database Setup
1. **Create MySQL Database** on Hostinger
2. **Import Database Schema** (run these SQL commands):

```sql
-- Create database
CREATE DATABASE smartreport_pro;

-- Use database
USE smartreport_pro;

-- Users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  firebaseUid VARCHAR(255),
  isEmailVerified BOOLEAN DEFAULT FALSE,
  plan VARCHAR(50) DEFAULT 'free',
  subscriptionStartDate DATETIME,
  subscriptionEndDate DATETIME,
  isAdmin BOOLEAN DEFAULT FALSE,
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  plan ENUM('Free', 'Pro', 'For Growing Businesses', 'Enterprise') DEFAULT 'Free',
  status ENUM('active', 'inactive', 'cancelled', 'expired', 'trial') DEFAULT 'trial',
  startDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  endDate DATETIME,
  trialEndsAt DATETIME,
  paymentProvider ENUM('paypal', 'stripe', 'lemonsqueezy', 'manual'),
  paymentId VARCHAR(255),
  subscriptionId VARCHAR(255) UNIQUE,
  reportsGenerated INT DEFAULT 0,
  reportsLimit INT DEFAULT 5,
  teamMembers INT DEFAULT 1,
  teamMembersLimit INT DEFAULT 1,
  apiCalls INT DEFAULT 0,
  apiCallsLimit INT DEFAULT 0,
  hasApiAccess BOOLEAN DEFAULT FALSE,
  hasCustomBranding BOOLEAN DEFAULT FALSE,
  hasPrioritySupport BOOLEAN DEFAULT FALSE,
  hasAdvancedAnalytics BOOLEAN DEFAULT FALSE,
  hasTeamManagement BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Payment Requests table
CREATE TABLE payment_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  plan ENUM('Pro', 'For Growing Businesses', 'Enterprise') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paymentMethod ENUM('binance', 'usdt', 'visa') NOT NULL,
  transactionId VARCHAR(255),
  proofUrl VARCHAR(500),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  approvedAt DATETIME,
  approvedBy VARCHAR(36),
  rejectionReason TEXT,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Enterprise Contacts table
CREATE TABLE enterprise_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  budget VARCHAR(100),
  status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
  submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  contactedAt DATETIME,
  closedAt DATETIME,
  notes TEXT,
  assignedTo VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE reports (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  templateId VARCHAR(36),
  data JSON,
  status ENUM('draft', 'generating', 'completed', 'failed') DEFAULT 'draft',
  fileUrl VARCHAR(500),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Templates table
CREATE TABLE templates (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  isPremium BOOLEAN DEFAULT FALSE,
  data JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  type ENUM('template', 'offer', 'update', 'system') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### 5. Features Implemented

✅ **Manual Payment System**
- Binance Pay (ID: 713636914)
- USDT (TRC20: TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX)
- Visa Card (4006930002826976)
- 2-hour approval SLA

✅ **Admin Dashboard**
- User management
- Payment approval system
- Enterprise contact management
- Analytics and reporting

✅ **Enterprise Contact System**
- Contact form submissions
- Email notifications to support@smartreportpro.aizetecc.com
- Admin management interface

✅ **Real File Upload & Report Generation**
- CSV/Excel/JSON file upload
- PDF report generation with jsPDF
- File storage and download

✅ **Email Notifications**
- Payment approval/rejection emails
- Enterprise contact notifications
- SMTP configuration ready

### 6. API Endpoints

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/admin/login` - Admin login

**Payment Requests:**
- `POST /api/payment-requests` - Submit payment request
- `GET /api/payment-requests` - Get user's requests
- `PUT /api/payment-requests/:id/approve` - Approve payment (admin)
- `PUT /api/payment-requests/:id/reject` - Reject payment (admin)

**Enterprise Contacts:**
- `POST /api/enterprise-contacts` - Submit inquiry
- `GET /api/enterprise-contacts/admin` - Get all inquiries (admin)

**Admin Dashboard:**
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/payments` - Payment management
- `GET /api/admin/reports` - Report management

### 7. Admin Access
- **Email**: support@smartreportpro.aizetecc.com
- **Password**: letmein
- **Dashboard**: `/admin/dashboard` (after login)

### 8. Testing
After deployment, test these endpoints:
1. `GET /` - Health check
2. `POST /api/admin/login` - Admin login
3. `POST /api/enterprise-contacts` - Enterprise contact form
4. `POST /api/payment-requests` - Manual payment submission

## 🎯 Next Steps
1. Deploy to Vercel with environment variables
2. Test all endpoints
3. Configure frontend to use new backend URL
4. Set up email notifications
5. Test manual payment flow
6. Test admin dashboard access
=======
# SmartReport Pro

**Transform Your Data into Professional Reports in Minutes**

A no-code SaaS platform that enables businesses to automatically generate stunning, professional reports from various data sources without technical expertise.

## 🚀 Features

### Core Features (MVP)

- **Data Import**: Drag & drop Excel/CSV file upload with support for multiple data formats
- **Report Templates**: 5+ pre-designed professional templates for Business, Marketing, and Financial reports
- **Visualization Engine**: Basic charts (Bar, Line, Pie, Donut) with data tables and key metric cards
- **Export & Share**: PDF export with professional layout, Excel download, and shareable links
- **User Management**: Simple registration/login with report history and storage

### Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Libraries**: Chart.js, FilePond, jsPDF, XLSX.js
- **Design**: Mobile-first responsive design with CSS Grid/Flexbox
- **Architecture**: RESTful API ready, localStorage for demo data

## 📁 Project Structure

```
SmartReport Pro/
├── index.html              # Landing page
├── dashboard.html          # User dashboard
├── styles/
│   ├── main.css           # Core styles and CSS variables
│   ├── components.css     # Component-specific styles
│   └── responsive.css     # Responsive design
├── js/
│   ├── app.js            # Main application logic
│   ├── auth.js           # Authentication system
│   ├── charts.js         # Chart management
│   └── dashboard.js      # Dashboard functionality
└── README.md             # Project documentation
```

## 🎯 Target Customers

- Small & Medium Businesses
- Freelancers & Consultants
- Marketing Agencies
- Financial Analysts
- Startup Founders

## 💰 Pricing Plans

### Free Tier
- 3 reports per month
- Basic templates
- Standard export quality

### Pro Plan - $19/month
- Unlimited reports
- All templates
- Priority support
- Brand removal

### Business Plan - $49/month
- Team collaboration
- White-label options
- Advanced analytics
- API access

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari)
- No additional dependencies required

### Installation

1. Clone or download the project
2. Open `index.html` in your web browser
3. Start creating reports!

### Usage

1. **Sign Up**: Create a free account
2. **Import Data**: Upload Excel/CSV files
3. **Choose Template**: Select from professional templates
4. **Customize**: Add charts and visualizations
5. **Export**: Download as PDF or Excel

## 🎨 Design Features

- **Clean & Professional**: Modern UI with intuitive user experience
- **Fully Responsive**: Mobile-first design that works on all devices
- **Accessible**: WCAG compliant with keyboard navigation
- **Fast Loading**: Optimized performance with minimal dependencies

## 📊 Report Templates

1. **Business Report**: Professional business analysis template
2. **Marketing Report**: Marketing performance and analytics
3. **Financial Report**: Financial data visualization
4. **Sales Report**: Sales performance tracking
5. **Analytics Report**: Data analytics and insights

## 🔧 Technical Requirements

- **Browser Compatibility**: Chrome, Firefox, Safari (latest versions)
- **File Size Limit**: <50MB per upload
- **Data Privacy**: Client-side processing with optional server integration
- **Performance**: Fast loading with optimized assets

## 🎯 Success Metrics

- User registration conversion rate
- Report creation completion rate
- User retention (weekly/monthly)
- Customer satisfaction score

## 🛠️ Development

### Local Development

1. Open the project in your preferred code editor
2. Use a local server (e.g., Live Server extension in VS Code)
3. Make changes and refresh the browser

### File Structure

- **HTML**: Semantic markup with accessibility in mind
- **CSS**: Modular styles with CSS custom properties
- **JavaScript**: ES6+ with modular architecture
- **Assets**: Optimized images and icons

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced layout for tablets (768px+)
- **Desktop**: Full-featured experience (1024px+)

## 🔒 Security & Privacy

- Client-side data processing
- No server-side data storage in MVP
- Secure file handling
- Privacy-focused design

## 🚀 Future Enhancements

- Backend API integration
- Real-time collaboration
- Advanced analytics
- White-label options
- Team management features

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support and questions:
- Email: support@smartreportpro.com
- Documentation: Available in the application
- Community: Coming soon

---

**SmartReport Pro** - Transform your data into professional reports in minutes! 🚀
>>>>>>> 3589d52cd0a7daa17346c73709ed174a90793767
