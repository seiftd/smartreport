const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://smartreportpro.aizetecc.com',
    'https://www.smartreportpro.aizetecc.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Additional CORS headers
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

// Middleware
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    origin: req.headers.origin 
  });
});

// Mock user stats
app.get('/api/user/stats', (req, res) => {
  res.json({
    totalReports: 5,
    reportsThisMonth: 3,
    timeSaved: 12,
    currentPlan: 'free',
    reportsUsed: 2,
    reportsLimit: 3
  });
});

// Mock reports
app.get('/api/reports', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Sales Report Q1',
      createdAt: new Date().toISOString(),
      status: 'completed'
    },
    {
      id: '2', 
      title: 'Marketing Analysis',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    }
  ]);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Test endpoint: http://localhost:${PORT}/api/test`);
});

module.exports = app;
