import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Star, 
  Download, 
  MessageSquare, 
  Settings,
  Clock,
  Trash2,
  CheckCircle,
  Crown
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const NotificationsPanel = ({ isOpen, onClose, notifications = [], onMarkAsRead, onDelete }) => {
  const [filter, setFilter] = useState('all'); // all, unread, system, updates, support

  // Use real notifications from backend, fallback to mock if empty
  const displayNotifications = notifications && notifications.length > 0 ? notifications : [
    {
      id: 1,
      type: 'template',
      title: 'New Template Available',
      message: 'Sales Performance Dashboard template has been added to your library.',
      timestamp: '2 hours ago',
      isRead: false,
      icon: Star,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 2,
      type: 'offer',
      title: 'Special Offer: 50% Off Pro Plan',
      message: 'Limited time offer! Upgrade to Pro plan and get 50% off your first 3 months.',
      timestamp: '4 hours ago',
      isRead: false,
      icon: Crown,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      id: 3,
      type: 'update',
      title: 'Report Generation Complete',
      message: 'Your Q4 Sales Report has been successfully generated and is ready for download.',
      timestamp: '6 hours ago',
      isRead: false,
      icon: Download,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 4,
      type: 'template',
      title: 'New Template: Financial Analysis',
      message: 'Advanced Financial Analysis template with 15+ chart types is now available.',
      timestamp: '1 day ago',
      isRead: true,
      icon: Star,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 5,
      type: 'offer',
      title: 'Enterprise Plan Features',
      message: 'New Enterprise features: White-label solution, API access, and dedicated support.',
      timestamp: '2 days ago',
      isRead: true,
      icon: Crown,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      id: 6,
      type: 'system',
      title: 'System Update Available',
      message: 'Version 2.1.0 is now available with improved performance and new features.',
      timestamp: '3 days ago',
      isRead: true,
      icon: Settings,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  const filteredNotifications = displayNotifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = displayNotifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId) => {
    if (onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
  };

  const handleDelete = (notificationId) => {
    if (onDelete) {
      onDelete(notificationId);
    }
  };

  const handleMarkAllAsRead = () => {
    displayNotifications.forEach(notification => {
      if (!notification.isRead) {
        handleMarkAsRead(notification.id);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 flex items-start justify-end z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-900 dark:text-white" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 p-4 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'all', label: 'All', count: displayNotifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'template', label: 'Templates', count: displayNotifications.filter(n => n.type === 'template').length },
              { id: 'offer', label: 'Offers', count: displayNotifications.filter(n => n.type === 'offer').length },
              { id: 'update', label: 'Updates', count: displayNotifications.filter(n => n.type === 'update').length },
              { id: 'system', label: 'System', count: displayNotifications.filter(n => n.type === 'system').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filter === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-96">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === 'unread' 
                    ? 'All caught up! No unread notifications.' 
                    : 'No notifications match your current filter.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-5 h-5 ${notification.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                !notification.isRead 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                  {notification.timestamp}
                                </span>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                >
                                  <Check className="w-3 h-3 text-blue-500" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(notification.id)}
                                className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {displayNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Clear all notifications
                    displayNotifications.forEach(notification => {
                      handleDelete(notification.id);
                    });
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationsPanel;
