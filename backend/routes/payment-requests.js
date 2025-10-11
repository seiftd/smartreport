const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { PaymentRequest } = require('../models');
const { updateSubscriptionPlan } = require('./subscriptions');

// Submit payment request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { plan, amount, paymentMethod, transactionId, proofUrl } = req.body;

    // Validate input
    if (!plan || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Plan, amount, and payment method are required'
      });
    }

    // Validate plan
    const validPlans = ['Pro', 'For Growing Businesses', 'Enterprise'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan specified'
      });
    }

    // Validate payment method
    const validMethods = ['binance', 'usdt', 'visa'];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // Create payment request
    const paymentRequest = await PaymentRequest.create({
      userId: req.user.id,
      plan,
      amount: parseFloat(amount),
      paymentMethod,
      transactionId,
      proofUrl,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Payment request submitted successfully. It will be reviewed within 2 hours.',
      paymentRequest
    });

  } catch (error) {
    console.error('Payment request submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit payment request'
    });
  }
});

// Get user's payment requests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const paymentRequests = await PaymentRequest.findAll({
      where: { userId: req.user.id },
      order: [['submittedAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      paymentRequests
    });

  } catch (error) {
    console.error('Error fetching payment requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment requests'
    });
  }
});

// Admin: Get all payment requests
router.get('/admin', requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows: paymentRequests } = await PaymentRequest.findAndCountAll({
      where: whereClause,
      order: [['submittedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: require('../models').User,
          attributes: ['id', 'email', 'name']
        }
      ]
    });

    res.status(200).json({
      success: true,
      paymentRequests,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching admin payment requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment requests'
    });
  }
});

// Admin: Approve payment request
router.put('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const paymentRequest = await PaymentRequest.findByPk(id);
    
    if (!paymentRequest) {
      return res.status(404).json({
        success: false,
        message: 'Payment request not found'
      });
    }

    if (paymentRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment request is not pending'
      });
    }

    // Update payment request
    await paymentRequest.update({
      status: 'approved',
      approvedAt: new Date(),
      approvedBy: req.user.id,
      notes
    });

    // Update user subscription
    try {
      await updateSubscriptionPlan(req, res, () => {
        // This will be handled by the subscription route
      });
    } catch (subscriptionError) {
      console.error('Error updating subscription:', subscriptionError);
      // Continue with approval even if subscription update fails
    }

    res.status(200).json({
      success: true,
      message: 'Payment request approved successfully',
      paymentRequest
    });

  } catch (error) {
    console.error('Error approving payment request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve payment request'
    });
  }
});

// Admin: Reject payment request
router.put('/:id/reject', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason, notes } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const paymentRequest = await PaymentRequest.findByPk(id);
    
    if (!paymentRequest) {
      return res.status(404).json({
        success: false,
        message: 'Payment request not found'
      });
    }

    if (paymentRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment request is not pending'
      });
    }

    // Update payment request
    await paymentRequest.update({
      status: 'rejected',
      approvedAt: new Date(),
      approvedBy: req.user.id,
      rejectionReason,
      notes
    });

    res.status(200).json({
      success: true,
      message: 'Payment request rejected',
      paymentRequest
    });

  } catch (error) {
    console.error('Error rejecting payment request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject payment request'
    });
  }
});

// Get payment request by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const paymentRequest = await PaymentRequest.findByPk(id);
    
    if (!paymentRequest) {
      return res.status(404).json({
        success: false,
        message: 'Payment request not found'
      });
    }

    // Check if user owns this request or is admin
    if (paymentRequest.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      paymentRequest
    });

  } catch (error) {
    console.error('Error fetching payment request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment request'
    });
  }
});

module.exports = router;
