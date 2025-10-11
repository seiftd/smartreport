import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Flame,
  ChevronDown,
  MoreHorizontal,
  TrendingDown,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const PremiumDashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Enhanced stats with more data
  const [stats, setStats] = useState({
    totalReports: 0,
    thisMonth: 0,
    timeSaved: 0,
    currentPlan: 'Free',
    revenue: 0,
    conversionRate: 0,
    activeUsers: 0,
    growthRate: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    setStats({
      totalReports: 127,
      thisMonth: 23,
      timeSaved: 48,
      currentPlan: 'Pro',
      revenue: 12450,
      conversionRate: 12.5,
      activeUsers: 2340,
      growthRate: 8.2
    });
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

  // Enhanced stat cards with Untitled UI design
  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      trend: '+12.5%',
      trendColor: 'text-emerald-500',
      bgColor: 'from-emerald-50 to-teal-50',
      delay: 0.1,
      change: '+$1,250'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: '+8.2%',
      trendColor: 'text-blue-500',
      bgColor: 'from-blue-50 to-cyan-50',
      delay: 0.2,
      change: '+180'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      trend: '+2.1%',
      trendColor: 'text-purple-500',
      bgColor: 'from-purple-50 to-pink-50',
      delay: 0.3,
      change: '+0.3%'
    },
    {
      title: 'Reports Created',
      value: stats.totalReports,
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      trend: '+15.3%',
      trendColor: 'text-orange-500',
      bgColor: 'from-orange-50 to-red-50',
      delay: 0.4,
      change: '+17'
    }
  ];

  const recentReports = [
    {
      id: 1,
      title: 'Q4 Sales Performance',
      status: 'completed',
      createdAt: '2024-01-15',
      template: 'Sales Analytics',
      downloads: 15,
      revenue: 2500,
      author: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Marketing Campaign ROI',
      status: 'processing',
      createdAt: '2024-01-14',
      template: 'Marketing Dashboard',
      downloads: 8,
      revenue: 1800,
      author: 'Mike Chen'
    },
    {
      id: 3,
      title: 'Financial Q4 Summary',
      status: 'completed',
      createdAt: '2024-01-13',
      template: 'Financial Report',
      downloads: 23,
      revenue: 3200,
      author: 'Emily Davis'
    },
    {
      id: 4,
      title: 'Customer Analytics',
      status: 'draft',
      createdAt: '2024-01-12',
      template: 'Customer Insights',
      downloads: 5,
      revenue: 0,
      author: 'Alex Rodriguez'
    }
  ];

  const templates = [
    {
      name: 'Sales Analytics',
      category: 'Business',
      description: 'Comprehensive sales performance analysis',
      icon: BarChart,
      color: 'from-blue-500 to-blue-600',
      usage: 45,
      rating: 4.8
    },
    {
      name: 'Financial Report',
      category: 'Finance',
      description: 'Detailed financial statements and metrics',
      icon: PieChart,
      color: 'from-green-500 to-green-600',
      usage: 32,
      rating: 4.9
    },
    {
      name: 'Marketing Dashboard',
      category: 'Marketing',
      description: 'Campaign performance and ROI analysis',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      usage: 28,
      rating: 4.7
    },
    {
      name: 'Operations Report',
      category: 'Operations',
      description: 'Operational efficiency and KPI tracking',
      icon: LineChart,
      color: 'from-orange-500 to-orange-600',
      usage: 19,
      rating: 4.6
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Enhanced Navigation */}
      <nav className="glass-card mx-4 mt-4 rounded-2xl border border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">SmartReport Pro</span>
                <p className="text-sm text-gray-500">Analytics Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reports, templates..."
                  className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="hover:bg-white/10"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 hover:bg-white/10"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.photoURL} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                      {user?.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user?.displayName || 'User'}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 glass-card rounded-2xl p-2 z-50 border border-white/20"
                    >
                      <div className="p-3 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user?.photoURL} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                              {user?.displayName?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user?.displayName || 'User'}</div>
                            <div className="text-sm text-gray-500">{user?.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Button variant="ghost" className="w-full justify-start">
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <Bell className="w-4 h-4 mr-3" />
                          Notifications
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <Crown className="w-4 h-4 mr-3" />
                          Upgrade Plan
                        </Button>
                        <div className="border-t border-white/10 my-2"></div>
                        <Button
                          variant="ghost"
                          onClick={handleSignOut}
                          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex items-center space-x-2 mt-4">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "glassPrimary" : "ghost"}
                onClick={() => setActiveSection(item.id)}
                className="flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            ))}
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
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold gradient-text mb-2"
                >
                  Welcome back, {user?.displayName?.split(' ')[0] || 'User'}! 👋
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 text-lg"
                >
                  Here's what's happening with your reports today.
                </motion.p>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2
                    }}
                    transition={{ 
                      delay: stat.delay, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <Card className="glass-card hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden border border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <motion.div 
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}
                          >
                            <stat.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${stat.trendColor} flex items-center space-x-1`}>
                              {stat.trend.startsWith('+') ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              )}
                              <span>{stat.trend}</span>
                            </div>
                            <div className="text-xs text-gray-500">{stat.change}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {stat.value}
                          </h3>
                          <p className="text-gray-600 font-medium">{stat.title}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Reports */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2"
                >
                  <Card className="glass-card border border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-800">Recent Reports</CardTitle>
                          <CardDescription>Your latest report activity</CardDescription>
                        </div>
                        <Button variant="glassPrimary" className="flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>New Report</span>
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {recentReports.map((report) => (
                          <motion.div 
                            key={report.id}
                            whileHover={{ scale: 1.01, x: 4 }}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {report.title}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>{report.template}</span>
                                  <span>•</span>
                                  <span>{report.downloads} downloads</span>
                                  <span>•</span>
                                  <span>${report.revenue.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={
                                  report.status === 'completed' ? 'success' : 
                                  report.status === 'processing' ? 'warning' : 'outline'
                                }
                              >
                                {report.status}
                              </Badge>
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions & Templates */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Quick Actions */}
                  <Card className="glass-card border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {templates.slice(0, 4).map((template, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center`}>
                              <template.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {template.name}
                              </h3>
                              <p className="text-sm text-gray-600">{template.category}</p>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Popular Templates */}
                  <Card className="glass-card border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Popular Templates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {templates.map((template, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center`}>
                                <template.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {template.name}
                                </h3>
                                <p className="text-xs text-gray-600">{template.usage} uses</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">{template.rating}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PremiumDashboard;
