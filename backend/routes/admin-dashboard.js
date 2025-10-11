const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/admin');
const { User, PaymentRequest, EnterpriseContact, Report, Subscription } = require('../models');
const { Op } = require('sequelize');

// Get admin dashboard statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total users
    const totalUsers = await User.count();

    // Get new users in last 30 days
    const newUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Get active subscriptions
    const activeSubscriptions = await Subscription.count({
      where: {
        status: 'active'
      }
    });

    // Get pending payment requests
    const pendingPayments = await PaymentRequest.count({
      where: {
        status: 'pending'
      }
    });

    // Get total revenue (from approved payments)
    const totalRevenue = await PaymentRequest.sum('amount', {
      where: {
        status: 'approved'
      }
    });

    // Get monthly revenue
    const monthlyRevenue = await PaymentRequest.sum('amount', {
      where: {
        status: 'approved',
        approvedAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Get total reports generated
    const totalReports = await Report.count();

    // Get reports generated in last 30 days
    const recentReports = await Report.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Get new enterprise contacts
    const newEnterpriseContacts = await EnterpriseContact.count({
      where: {
        status: 'new'
      }
    });

    // Get user growth over time (last 7 days)
    const userGrowth = await User.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      },
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
    });

    // Get revenue by plan
    const revenueByPlan = await PaymentRequest.findAll({
      attributes: [
        'plan',
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'totalRevenue'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: {
        status: 'approved'
      },
      group: ['plan']
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        newUsers,
        activeSubscriptions,
        pendingPayments,
        totalRevenue: totalRevenue || 0,
        monthlyRevenue: monthlyRevenue || 0,
        totalReports,
        recentReports,
        newEnterpriseContacts,
        userGrowth,
        revenueByPlan
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics'
    });
  }
});

// Get all users with subscription details
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, plan, status } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};
    const subscriptionWhere = {};

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { email: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } }
      ];
    }

    // Plan filter
    if (plan) {
      subscriptionWhere.plan = plan;
    }

    // Status filter
    if (status) {
      subscriptionWhere.status = status;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Subscription,
          where: subscriptionWhere,
          required: false
        }
      ]
    });

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get all payments
router.get('/payments', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentMethod } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (paymentMethod) {
      whereClause.paymentMethod = paymentMethod;
    }

    const { count, rows: payments } = await PaymentRequest.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['submittedAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'name']
        }
      ]
    });

    res.status(200).json({
      success: true,
      payments,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments'
    });
  }
});

// Get all reports
router.get('/reports', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: reports } = await Report.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'name']
        }
      ]
    });

    res.status(200).json({
      success: true,
      reports,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
});

// Manually update user subscription
router.put('/users/:id/subscription', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, status, features } = req.body;

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find or create subscription
    let subscription = await Subscription.findOne({
      where: { userId: id }
    });

    if (!subscription) {
      subscription = await Subscription.create({
        userId: id,
        plan: plan || 'Free',
        status: status || 'active',
        features: features || Subscription.getPlanFeatures(plan || 'Free')
      });
    } else {
      // Update existing subscription
      const updateData = {};
      
      if (plan) updateData.plan = plan;
      if (status) updateData.status = status;
      if (features) updateData.features = features;
      else if (plan) updateData.features = Subscription.getPlanFeatures(plan);

      await subscription.update(updateData);
    }

    res.status(200).json({
      success: true,
      message: 'User subscription updated successfully',
      subscription
    });

  } catch (error) {
    console.error('Error updating user subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user subscription'
    });
  }
});

// Get user details
router.get('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Subscription,
          required: false
        },
        {
          model: PaymentRequest,
          order: [['submittedAt', 'DESC']]
        },
        {
          model: Report,
          order: [['createdAt', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
});

module.exports = router;
