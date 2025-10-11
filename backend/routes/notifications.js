const express = require('express');
const router = express.Router();

// Mock notifications data for now
const mockNotifications = [
  {
    id: 1,
    type: 'template',
    title: 'New Template Available',
    message: 'Sales Performance Dashboard template has been added to your library.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    userId: 'user123'
  },
  {
    id: 2,
    type: 'offer',
    title: 'Special Offer: 50% Off Pro Plan',
    message: 'Limited time offer! Upgrade to Pro plan and get 50% off your first 3 months.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    isRead: false,
    userId: 'user123'
  },
  {
    id: 3,
    type: 'update',
    title: 'Report Generation Complete',
    message: 'Your Q4 Sales Report has been successfully generated and is ready for download.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    isRead: false,
    userId: 'user123'
  },
  {
    id: 4,
    type: 'template',
    title: 'New Template: Financial Analysis',
    message: 'Advanced Financial Analysis template with 15+ chart types is now available.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true,
    userId: 'user123'
  },
  {
    id: 5,
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance will occur on Sunday, 2:00 AM - 4:00 AM UTC.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRead: true,
    userId: 'user123'
  }
];

// GET /api/notifications - Get all notifications for user
router.get('/', (req, res) => {
  try {
    // In a real app, you'd filter by user ID from JWT token
    const userId = req.user?.id || 'user123';
    const userNotifications = mockNotifications.filter(n => n.userId === userId);
    
    res.json(userNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.user?.id || 'user123';
    
    // Find and update notification
    const notification = mockNotifications.find(n => n.id === notificationId && n.userId === userId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notification.isRead = true;
    
    res.json({ 
      success: true, 
      message: 'Notification marked as read',
      notification 
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.user?.id || 'user123';
    
    // Find and remove notification
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId && n.userId === userId);
    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    mockNotifications.splice(notificationIndex, 1);
    
    res.json({ 
      success: true, 
      message: 'Notification deleted' 
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', (req, res) => {
  try {
    const userId = req.user?.id || 'user123';
    
    // Mark all user notifications as read
    mockNotifications.forEach(notification => {
      if (notification.userId === userId) {
        notification.isRead = true;
      }
    });
    
    res.json({ 
      success: true, 
      message: 'All notifications marked as read' 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

module.exports = router;
