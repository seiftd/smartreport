import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut, 
  Plus,
  TrendingUp,
  Users,
  Download,
  Eye,
  Edit,
  Trash2,
  Moon,
  Sun,
  Bell,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Star,
  ArrowUpRight,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Lightbulb,
  Rocket,
  Heart,
  ThumbsUp,
  Globe,
  Shield,
  Sparkles,
  Crown,
  Gem,
  Flame
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    thisMonth: 0,
    timeSaved: 0,
    currentPlan: 'Free'
  });

  // Mock data for demonstration
  useEffect(() => {
    setStats({
      totalReports: 12,
      thisMonth: 5,
      timeSaved: 24,
      currentPlan: 'Pro'
    });

    setReports([
      {
        id: 1,
        title: 'Q4 Sales Report',
        status: 'completed',
        createdAt: '2024-01-15',
        template: 'Sales Analytics',
        downloads: 15
      },
      {
        id: 2,
        title: 'Marketing Performance',
        status: 'processing',
        createdAt: '2024-01-14',
        template: 'Marketing Dashboard',
        downloads: 8
      },
      {
        id: 3,
        title: 'Financial Summary',
        status: 'completed',
        createdAt: '2024-01-13',
        template: 'Financial Report',
        downloads: 23
      }
    ]);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      trend: '+12%',
      trendColor: 'text-green-500',
      bgColor: 'from-blue-50 to-cyan-50',
      delay: 0.1
    },
    {
      title: 'This Month',
      value: stats.thisMonth,
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      trend: '+8%',
      trendColor: 'text-green-500',
      bgColor: 'from-green-50 to-emerald-50',
      delay: 0.2
    },
    {
      title: 'Time Saved',
      value: `${stats.timeSaved}h`,
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      trend: '+15%',
      trendColor: 'text-purple-500',
      bgColor: 'from-purple-50 to-pink-50',
      delay: 0.3
    },
    {
      title: 'Current Plan',
      value: stats.currentPlan,
      icon: Crown,
      color: 'from-orange-500 to-yellow-500',
      trend: 'Active',
      trendColor: 'text-orange-500',
      bgColor: 'from-orange-50 to-yellow-50',
      delay: 0.4
    }
  ];

  const templates = [
    {
      name: 'Sales Analytics',
      category: 'Business',
      description: 'Comprehensive sales performance analysis',
      icon: BarChart,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Financial Report',
      category: 'Finance',
      description: 'Detailed financial statements and metrics',
      icon: PieChart,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Marketing Dashboard',
      category: 'Marketing',
      description: 'Campaign performance and ROI analysis',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Operations Report',
      category: 'Operations',
      description: 'Operational efficiency and KPI tracking',
      icon: LineChart,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="glass-card mx-4 mt-4 rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">SmartReport Pro</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeSection === item.id
                      ? 'glass-button-primary'
                      : 'glass-button'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="glass-button p-3"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 glass-button p-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.displayName?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{user?.displayName || 'User'}</div>
                  <div className="text-xs text-gray-600">{user?.email}</div>
                </div>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-2 z-50"
                  >
                    <button className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Settings className="w-4 h-4 inline mr-3" />
                      Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Bell className="w-4 h-4 inline mr-3" />
                      Notifications
                    </button>
                    <div className="border-t border-white/10 my-2"></div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-600"
                    >
                      <LogOut className="w-4 h-4 inline mr-3" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold gradient-text mb-2">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-gray-600 text-lg">Here's what's happening with your reports today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      rotateY: 5
                    }}
                    transition={{ 
                      delay: stat.delay, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="glass-card p-6 hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  >
                    {/* Animated Background */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className={`absolute inset-0 bg-gradient-to-r ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div 
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}
                        >
                          <stat.icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <motion.span 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: stat.delay + 0.2 }}
                          className={`text-sm font-bold ${stat.trendColor} flex items-center space-x-1`}
                        >
                          <TrendingUp className="w-4 h-4" />
                          <span>{stat.trend}</span>
                        </motion.span>
                      </div>
                      
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stat.delay + 0.3 }}
                        className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors"
                      >
                        {stat.value}
                      </motion.h3>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stat.delay + 0.4 }}
                        className="text-gray-600 font-medium"
                      >
                        {stat.title}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Reports */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Recent Reports</h2>
                    <button className="glass-button-primary flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>New Report</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{report.title}</h3>
                            <p className="text-sm text-gray-600">{report.template}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status === 'completed' ? (
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                            ) : (
                              <AlertCircle className="w-3 h-3 inline mr-1" />
                            )}
                            {report.status}
                          </span>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {templates.slice(0, 4).map((template, index) => (
                      <button
                        key={index}
                        className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-left"
                      >
                        <div className={`w-8 h-8 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center mb-3`}>
                          <template.icon className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
                        <p className="text-xs text-gray-600">{template.category}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeSection === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card p-6">
                <h1 className="text-3xl font-bold gradient-text mb-6">Your Reports</h1>
                <p className="text-gray-600 mb-8">Manage and organize all your reports in one place.</p>
                
                <div className="grid gap-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-6 bg-white/10 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
                          <p className="text-gray-600">{report.template} • {report.downloads} downloads</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="glass-button p-2">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="glass-button p-2">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="glass-button p-2">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="glass-button p-2 text-red-600 hover:bg-red-500/20">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card p-6">
                <h1 className="text-3xl font-bold gradient-text mb-6">Report Templates</h1>
                <p className="text-gray-600 mb-8">Choose from our collection of professional report templates.</p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-xl flex items-center justify-center mb-4`}>
                        <template.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{template.name}</h3>
                      <p className="text-gray-600 mb-4">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{template.category}</span>
                        <button className="glass-button-primary flex items-center space-x-2">
                          <span>Use Template</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card p-6">
                <h1 className="text-3xl font-bold gradient-text mb-6">Analytics Dashboard</h1>
                <p className="text-gray-600 mb-8">Track your report performance and usage analytics.</p>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Report Generation</h3>
                    <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Chart visualization coming soon</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Template Usage</h3>
                    <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600">Usage analytics coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
