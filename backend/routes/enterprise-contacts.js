const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/admin');
const { EnterpriseContact } = require('../models');
const { sendEnterpriseContactEmail } = require('../services/emailService');

// Submit enterprise contact
router.post('/', async (req, res) => {
  try {
    const { email, content, budget } = req.body;

    // Validate input
    if (!email || !content) {
      return res.status(400).json({
        success: false,
        message: 'Email and content are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Create enterprise contact
    const enterpriseContact = await EnterpriseContact.create({
      email,
      content,
      budget,
      status: 'new'
    });

    // Send email notification
    try {
      await sendEnterpriseContactEmail(email, content, budget);
    } catch (emailError) {
      console.error('Error sending enterprise contact email:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted. We\'ll contact you soon!',
      enterpriseContact: {
        id: enterpriseContact.id,
        email: enterpriseContact.email,
        status: enterpriseContact.status,
        submittedAt: enterpriseContact.submittedAt
      }
    });

  } catch (error) {
    console.error('Enterprise contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit enterprise contact'
    });
  }
});

// Admin: Get all enterprise contacts
router.get('/admin', requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows: enterpriseContacts } = await EnterpriseContact.findAndCountAll({
      where: whereClause,
      order: [['submittedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      enterpriseContacts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching enterprise contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enterprise contacts'
    });
  }
});

// Admin: Get enterprise contact by ID
router.get('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const enterpriseContact = await EnterpriseContact.findByPk(id);
    
    if (!enterpriseContact) {
      return res.status(404).json({
        success: false,
        message: 'Enterprise contact not found'
      });
    }

    res.status(200).json({
      success: true,
      enterpriseContact
    });

  } catch (error) {
    console.error('Error fetching enterprise contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enterprise contact'
    });
  }
});

// Admin: Update enterprise contact status
router.put('/admin/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;

    const validStatuses = ['new', 'contacted', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const enterpriseContact = await EnterpriseContact.findByPk(id);
    
    if (!enterpriseContact) {
      return res.status(404).json({
        success: false,
        message: 'Enterprise contact not found'
      });
    }

    // Update status and related fields
    const updateData = { status };
    
    if (status === 'contacted') {
      updateData.contactedAt = new Date();
      if (assignedTo) {
        updateData.assignedTo = assignedTo;
      }
    } else if (status === 'closed') {
      updateData.closedAt = new Date();
    }

    if (notes) {
      updateData.notes = notes;
    }

    await enterpriseContact.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Enterprise contact updated successfully',
      enterpriseContact
    });

  } catch (error) {
    console.error('Error updating enterprise contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enterprise contact'
    });
  }
});

// Admin: Add notes to enterprise contact
router.put('/admin/:id/notes', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({
        success: false,
        message: 'Notes are required'
      });
    }

    const enterpriseContact = await EnterpriseContact.findByPk(id);
    
    if (!enterpriseContact) {
      return res.status(404).json({
        success: false,
        message: 'Enterprise contact not found'
      });
    }

    // Append to existing notes
    const existingNotes = enterpriseContact.notes || '';
    const newNotes = existingNotes ? `${existingNotes}\n\n${notes}` : notes;

    await enterpriseContact.update({ notes: newNotes });

    res.status(200).json({
      success: true,
      message: 'Notes added successfully',
      enterpriseContact
    });

  } catch (error) {
    console.error('Error adding notes to enterprise contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add notes'
    });
  }
});

module.exports = router;
