import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { 
  fetchUserStats, 
  fetchReports, 
  fetchTemplates, 
  getSubscription,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  getSubscriptionUsage,
  checkFeatureAccess
} from '../services/api';
import CreateReportModal from './CreateReportModal';
import EnhancedCreateReportModal from './EnhancedCreateReportModal';
import ViewReportModal from './ViewReportModal';
import EditReportModal from './EditReportModal';
import DeleteReportDialog from './DeleteReportDialog';
import ReportsSection from './ReportsSection';
import TemplatesSection from './TemplatesSection';
import SubscriptionCard from './SubscriptionCard';
import EmptyState from './EmptyState';
import UpgradeModal from './UpgradeModal';
import NotificationsPanel from './NotificationsPanel';
import TeamManagementCard from './TeamManagementCard';
import AdvancedAnalyticsCard from './AdvancedAnalyticsCard';
import CustomBrandingCard from './CustomBrandingCard';
import APIAccessCard from './APIAccessCard';
import PrioritySupportCard from './PrioritySupportCard';
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
  Palette,
  Code,
  HeadphonesIcon,
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
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Copy,
  Share,
  Archive,
  Tag,
  Folder,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const UntitledDashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Plan detection for advanced features
  const hasAdvancedFeatures = () => {
    const plan = subscription?.plan;
    const status = subscription?.status;
    
    // Check if subscription is active and has advanced features
    if (!subscription || status === 'expired' || status === 'cancelled') {
      return false;
    }
    
    return plan === 'Enterprise' || plan === 'For Growing Businesses' || plan === 'Pro';
  };

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReportTitle, setSelectedReportTitle] = useState('');

  // Enhanced stats with Untitled UI design
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    totalReports: 0,
    activeUsers: 0,
    growthRate: 0
  });

  const [reports, setReports] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [useEnhancedModal, setUseEnhancedModal] = useState(true);

  // Load real data from backend
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const [statsData, reportsData, templatesData, subscriptionData, notificationsData] = await Promise.all([
        fetchUserStats(token),
        fetchReports(token),
        fetchTemplates(token),
        getSubscription(token),
        getNotifications(token)
      ]);

      setStats(statsData);
      setReports(reportsData);
      setTemplates(templatesData);
      setSubscription(subscriptionData);
      setNotifications(notificationsData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      // Fallback to empty data if API fails
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        conversionRate: 0,
        avgOrderValue: 0,
        totalReports: 0,
        activeUsers: 0,
        growthRate: 0
      });
      // Empty data if API fails
      setReports([]);
      setTemplates([]);
      setSubscription({ plan: 'Free', status: 'active' });
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Reload the page to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Modal handlers
  const handleCreateReport = () => {
    setShowCreateModal(true);
  };

  const handleViewReport = (reportId, reportTitle) => {
    setSelectedReportId(reportId);
    setSelectedReportTitle(reportTitle);
    setShowViewModal(true);
  };

  const handleEditReport = (reportId) => {
    setSelectedReportId(reportId);
    setShowEditModal(true);
  };

  const handleDeleteReport = (reportId, reportTitle) => {
    setSelectedReportId(reportId);
    setSelectedReportTitle(reportTitle);
    setShowDeleteDialog(true);
  };

  const handleReportSuccess = () => {
    loadDashboardData(); // Refresh data
  };

  // Notification handlers
  const handleMarkNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await markNotificationAsRead(token, notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteNotification(token, notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    // Advanced features for "For Growing Businesses" users
    ...(hasAdvancedFeatures() ? [
      { id: 'team', label: 'Team', icon: Users },
      { id: 'branding', label: 'Branding', icon: Palette },
      { id: 'api', label: 'API Access', icon: Code },
      { id: 'support', label: 'Priority Support', icon: HeadphonesIcon }
    ] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Report-focused stat cards with real data
  const statCards = [
    {
      title: 'Total Reports',
      value: reports.length.toString(),
      change: '',
      changeType: 'neutral',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      delay: 0.1
    },
    {
      title: 'This Month',
      value: reports.filter(r => {
        const reportDate = new Date(r.createdAt || r.created_at);
        const now = new Date();
        return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
      }).length.toString(),
      change: '',
      changeType: 'neutral',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      delay: 0.2
    },
    {
      title: 'Templates Available',
      value: templates.length.toString(),
      change: '',
      changeType: 'neutral',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      delay: 0.3
    },
    {
      title: 'Storage Used',
      value: `${Math.round(reports.length * 0.1)}MB`,
      change: '',
      changeType: 'neutral',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      delay: 0.4
    }
  ];

  const recentReports = [
    {
      id: 1,
      title: 'Q4 Sales Performance Report',
      status: 'completed',
      createdAt: '2024-01-15',
      author: 'Sarah Johnson',
      downloads: 15,
      revenue: 2500,
      category: 'Sales',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Marketing Campaign ROI Analysis',
      status: 'processing',
      createdAt: '2024-01-14',
      author: 'Mike Chen',
      downloads: 8,
      revenue: 1800,
      category: 'Marketing',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Financial Q4 Summary',
      status: 'completed',
      createdAt: '2024-01-13',
      author: 'Emily Davis',
      downloads: 23,
      revenue: 3200,
      category: 'Finance',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Customer Analytics Dashboard',
      status: 'draft',
      createdAt: '2024-01-12',
      author: 'Alex Rodriguez',
      downloads: 5,
      revenue: 0,
      category: 'Analytics',
      priority: 'low'
    },
    {
      id: 5,
      title: 'Operations Efficiency Report',
      status: 'completed',
      createdAt: '2024-01-11',
      author: 'David Kim',
      downloads: 12,
      revenue: 1500,
      category: 'Operations',
      priority: 'medium'
    }
  ];

  // Mock templates for fallback when API data is not available
  const mockTemplates = [
    {
      name: 'Sales Performance',
      category: 'Sales',
      description: 'Comprehensive sales metrics and KPIs',
      icon: BarChart,
      color: 'from-blue-500 to-blue-600',
      usage: 45,
      rating: 4.8,
      downloads: 120
    },
    {
      name: 'Financial Summary',
      category: 'Finance',
      description: 'Revenue, expenses, and profit analysis',
      icon: PieChart,
      color: 'from-green-500 to-green-600',
      usage: 32,
      rating: 4.9,
      downloads: 89
    },
    {
      name: 'Marketing ROI',
      category: 'Marketing',
      description: 'Campaign performance and return on investment',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      usage: 28,
      rating: 4.7,
      downloads: 67
    },
    {
      name: 'Customer Insights',
      category: 'Analytics',
      description: 'Customer behavior and engagement metrics',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      usage: 19,
      rating: 4.6,
      downloads: 45
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Untitled UI inspired header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">SmartReport Pro</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Analytics Dashboard</p>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reports, templates..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

                  {/* Notifications */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={() => setShowNotifications(true)}
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                        {notifications.filter(n => !n.isRead).length}
                      </Badge>
                    )}
                  </Button>

              {/* Dark Mode */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>

              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3"
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
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
                    >
                      <div className="p-3 border-b border-gray-100">
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
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => setShowUpgradeModal(true)}
                        >
                          <Crown className="w-4 h-4 mr-3" />
                          Upgrade Plan
                        </Button>
                        <div className="border-t border-gray-100 my-2"></div>
                        <Button
                          variant="ghost"
                          onClick={handleSignOut}
                          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
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

          {/* Navigation */}
          <div className="flex items-center space-x-8 border-t border-gray-200 dark:border-gray-700">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === item.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Welcome Section with Create Report CTA */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your reports today.</p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      onClick={handleCreateReport}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Report
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Stats Grid - Untitled UI Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ 
                      delay: stat.delay, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium flex items-center space-x-1 ${
                              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stat.changeType === 'positive' ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              )}
                              <span>{stat.change}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Reports */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2"
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold">Recent Reports</CardTitle>
                          <CardDescription>Your latest report activity</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                          </Button>
                          <Button variant="default" size="sm" onClick={handleCreateReport}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Report
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {reports.length === 0 ? (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Reports Yet</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first report to get started</p>
                            <Button
                              onClick={handleCreateReport}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Your First Report
                            </Button>
                          </div>
                        ) : (
                          reports.slice(0, 5).map((report) => (
                          <motion.div 
                            key={report.id}
                            whileHover={{ scale: 1.01, x: 4 }}
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                  {report.title}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                  <span>{report.author || report.createdBy}</span>
                                  <span>•</span>
                                  <span>{report.downloads || 0} downloads</span>
                                  <span>•</span>
                                  <span>{report.category || 'General'}</span>
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
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewReport(report.id, report.title)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditReport(report.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteReport(report.id, report.title)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Advanced Features for "For Growing Businesses" users */}
                {hasAdvancedFeatures() && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                  >
                    <AdvancedAnalyticsCard />
                  </motion.div>
                )}

                {/* Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {templates.length === 0 ? (
                        <div className="text-center py-4">
                          <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">No templates available</p>
                        </div>
                      ) : (
                        templates.slice(0, 4).map((template, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center`}>
                              <template.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {template.name}
                              </h3>
                              <p className="text-sm text-gray-500">{template.category}</p>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </motion.div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  {/* Popular Templates */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Popular Templates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {templates.length === 0 ? (
                        <div className="text-center py-4">
                          <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">No templates available</p>
                        </div>
                      ) : (
                        templates.map((template, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center`}>
                                <template.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {template.name}
                                </h3>
                                <p className="text-xs text-gray-500">{template.usage} uses</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">{template.rating}</span>
                            </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </CardContent>
                      </Card>
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
              <ReportsSection
                reports={reports}
                onView={handleViewReport}
                onEdit={handleEditReport}
                onDelete={handleDeleteReport}
                onCreate={handleCreateReport}
                isLoading={isLoading}
              />
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
              <TemplatesSection
                templates={templates}
                onUseTemplate={(template) => {
                  setShowCreateModal(true);
                  // Pre-select template in modal
                }}
                onCreateCustom={handleCreateReport}
                isLoading={isLoading}
              />
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
              <div className="text-center py-16">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400">Advanced analytics features will be available soon.</p>
              </div>
            </motion.div>
          )}

          {activeSection === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
                  <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences.</p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <SubscriptionCard
                    subscription={subscription}
                    onUpgrade={() => setShowUpgradeModal(true)}
                    onManageBilling={() => {
                      // Open billing management
                      console.log('Manage billing clicked');
                    }}
                  />
                  
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Account Settings</CardTitle>
                      <CardDescription>Manage your profile and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Dark Mode</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleDarkMode}
                        >
                          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Notifications</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowNotifications(true)}
                        >
                          Manage ({notifications.filter(n => !n.isRead).length})
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Data Export</span>
                        <Button variant="outline" size="sm">
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* Advanced Features for "For Growing Businesses" users */}
          {activeSection === 'team' && hasAdvancedFeatures() && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Team Management</h2>
                  <p className="text-gray-600 dark:text-gray-400">Manage your team members and their permissions.</p>
                </div>
                <TeamManagementCard />
              </div>
            </motion.div>
          )}

          {activeSection === 'branding' && hasAdvancedFeatures() && (
            <motion.div
              key="branding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Custom Branding</h2>
                  <p className="text-gray-600 dark:text-gray-400">Customize your reports with your brand identity.</p>
                </div>
                <CustomBrandingCard />
              </div>
            </motion.div>
          )}

          {activeSection === 'api' && hasAdvancedFeatures() && (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">API Access</h2>
                  <p className="text-gray-600 dark:text-gray-400">Integrate SmartReport Pro with your applications.</p>
                </div>
                <APIAccessCard />
              </div>
            </motion.div>
          )}

          {activeSection === 'support' && hasAdvancedFeatures() && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Priority Support</h2>
                  <p className="text-gray-600 dark:text-gray-400">Get dedicated support with faster response times.</p>
                </div>
                <PrioritySupportCard />
              </div>
            </motion.div>
          )}

          {/* Access denied for non-advanced users */}
          {(activeSection === 'team' || activeSection === 'branding' || activeSection === 'api' || activeSection === 'support') && !hasAdvancedFeatures() && (
            <motion.div
              key="access-denied"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Advanced Features</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This feature is available for "For Growing Businesses" plan and above.
                </p>
                <Button onClick={() => setShowUpgradeModal(true)} className="bg-blue-600 hover:bg-blue-700">
                  Upgrade Plan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Components */}
          {useEnhancedModal ? (
            <EnhancedCreateReportModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onSuccess={handleReportSuccess}
              templates={templates}
              user={user}
            />
          ) : (
            <CreateReportModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onSuccess={handleReportSuccess}
              templates={templates}
            />
          )}

      <ViewReportModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        reportId={selectedReportId}
        onEdit={handleEditReport}
        onDelete={handleDeleteReport}
      />

      <EditReportModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        reportId={selectedReportId}
        onSuccess={handleReportSuccess}
      />

          <DeleteReportDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            reportId={selectedReportId}
            reportTitle={selectedReportTitle}
            onSuccess={handleReportSuccess}
          />

          <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            currentPlan={subscription?.plan || 'Free'}
          />

          <NotificationsPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onDelete={handleDeleteNotification}
          />
        </div>
      );
    };

    export default UntitledDashboard;
