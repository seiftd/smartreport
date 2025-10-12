const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database
const { testConnection, syncDatabase } = require('./config/database');

// Handle database connection gracefully
const initializeDatabase = async () => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      await syncDatabase();
      console.log('✅ Database initialized successfully');
    } else {
      console.log('⚠️ Database connection failed, running in limited mode');
    }
  } catch (error) {
    console.log('⚠️ Database initialization failed, running in limited mode:', error.message);
  }
};

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');
const templateRoutes = require('./routes/templates');
const paymentRoutes = require('./routes/payments');
const webhookRoutes = require('./routes/webhooks');
const notificationRoutes = require('./routes/notifications');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRequestRoutes = require('./routes/payment-requests');
const enterpriseContactRoutes = require('./routes/enterprise-contacts');
const adminAuthRoutes = require('./routes/admin-auth');
const adminDashboardRoutes = require('./routes/admin-dashboard');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.lemonsqueezy.com"]
    }
  }
}));

// CORS configuration - More permissive for development
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:8080',
      'https://smartreportpro.aizetecc.com',
      'https://www.smartreportpro.aizetecc.com',
      'https://smartreport-pro-backendone.vercel.app'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Additional CORS headers for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SmartReport Pro API is running!',
    status: 'success',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    database: process.env.DB_NAME ? 'Connected' : 'Not configured',
    email: process.env.SMTP_USER ? 'Configured' : 'Disabled',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Database test endpoint
app.get('/db-test', async (req, res) => {
  try {
    const { testConnection } = require('./config/database');
    const isConnected = await testConnection();
    
    res.json({
      database: isConnected ? 'Connected' : 'Failed',
      dbName: process.env.DB_NAME,
      dbHost: process.env.DB_HOST,
      dbUser: process.env.DB_USER,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      database: 'Error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);
app.use('/api/subscriptions', authenticateToken, subscriptionRoutes);
app.use('/api/payment-requests', paymentRequestRoutes);
app.use('/api/enterprise-contacts', enterpriseContactRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', adminDashboardRoutes);

// Serve static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection (non-blocking)
    const dbConnected = await testConnection();
    if (dbConnected) {
      console.log('✅ Database connected successfully');
      await syncDatabase();
    } else {
      console.log('⚠️ Database connection failed, running in limited mode');
    }

    // Start server regardless of database status
    app.listen(PORT, () => {
      console.log(`🚀 SmartReport Pro API Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`🗄️ Database: ${dbConnected ? 'Connected' : 'Limited mode'}`);
    });
  } catch (error) {
    console.error('⚠️ Database setup failed, starting server in limited mode:', error.message);
    
    // Start server even if database fails
    app.listen(PORT, () => {
      console.log(`🚀 SmartReport Pro API Server running on port ${PORT} (Limited mode)`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
